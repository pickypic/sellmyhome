import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { supabaseClient } from '../config/supabase';

@Injectable()
export class NotificationsService {
  // ── 알림 목록 조회 ─────────────────────────────
  async findAll(userId: string) {
    const { data } = await supabaseClient
      .from('notifications')
      .select('id, type, title, body, data, is_read, created_at')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
      .limit(50);

    const { count: unreadCount } = await supabaseClient
      .from('notifications')
      .select('*', { count: 'exact', head: true })
      .eq('user_id', userId)
      .eq('is_read', false);

    return { notifications: data, unread_count: unreadCount ?? 0 };
  }

  // ── 단일 알림 읽음 처리 ───────────────────────
  async markRead(notificationId: string, userId: string) {
    const { data: notif } = await supabaseClient
      .from('notifications')
      .select('user_id')
      .eq('id', notificationId)
      .single();

    if (!notif) throw new NotFoundException('알림을 찾을 수 없습니다.');
    if (notif.user_id !== userId) throw new ForbiddenException('접근 권한이 없습니다.');

    const { data } = await supabaseClient
      .from('notifications')
      .update({ is_read: true })
      .eq('id', notificationId)
      .select()
      .single();

    return data;
  }

  // ── 전체 알림 읽음 처리 ───────────────────────
  async markAllRead(userId: string) {
    await supabaseClient
      .from('notifications')
      .update({ is_read: true })
      .eq('user_id', userId)
      .eq('is_read', false);

    return { message: '모든 알림을 읽음 처리했습니다.' };
  }

  // ── 알림 생성 (내부용) — 다른 서비스에서 호출 ─
  async createNotification(dto: {
    user_id: string;
    type: string;
    title: string;
    body: string;
    data?: Record<string, any>;
  }) {
    const { data, error } = await supabaseClient
      .from('notifications')
      .insert({
        user_id: dto.user_id,
        type: dto.type,
        title: dto.title,
        body: dto.body,
        data: dto.data ?? {},
        is_read: false,
      })
      .select()
      .single();

    if (error) {
      console.error('[알림 생성 오류]', error.message);
      return null;
    }

    // FCM 푸시 발송 (fcm_token이 있으면)
    await this.sendFcmPush(dto.user_id, dto.title, dto.body, dto.data);

    return data;
  }

  // ── Firebase FCM 푸시 발송 (내부) ─────────────
  private async sendFcmPush(
    userId: string,
    title: string,
    body: string,
    data?: Record<string, any>,
  ) {
    const { data: user } = await supabaseClient
      .from('users')
      .select('fcm_token')
      .eq('id', userId)
      .single();

    if (!user?.fcm_token) return;

    const projectId = process.env.FIREBASE_PROJECT_ID;
    if (!projectId) return;

    try {
      // Firebase Admin SDK를 직접 임포트하지 않고 HTTP v1 API 호출
      // (firebase-admin 미설치 환경 대비)
      const accessToken = await this.getFirebaseAccessToken();
      if (!accessToken) return;

      await fetch(
        `https://fcm.googleapis.com/v1/projects/${projectId}/messages:send`,
        {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${accessToken}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            message: {
              token: user.fcm_token,
              notification: { title, body },
              data: data ? Object.fromEntries(
                Object.entries(data).map(([k, v]) => [k, String(v)])
              ) : {},
            },
          }),
        },
      );
    } catch (err) {
      console.error('[FCM 발송 오류]', err);
    }
  }

  // ── Firebase HTTP v1 액세스 토큰 발급 (내부) ──
  private async getFirebaseAccessToken(): Promise<string | null> {
    const privateKey = process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n');
    const clientEmail = process.env.FIREBASE_CLIENT_EMAIL;
    if (!privateKey || !clientEmail) return null;

    try {
      // JWT 직접 생성 (jsonwebtoken 패키지 사용)
      // eslint-disable-next-line @typescript-eslint/no-var-requires
      const jwt = require('jsonwebtoken');
      const now = Math.floor(Date.now() / 1000);
      const assertion = jwt.sign(
        {
          iss: clientEmail,
          sub: clientEmail,
          aud: 'https://oauth2.googleapis.com/token',
          iat: now,
          exp: now + 3600,
          scope: 'https://www.googleapis.com/auth/firebase.messaging',
        },
        privateKey,
        { algorithm: 'RS256' },
      );

      const res = await fetch('https://oauth2.googleapis.com/token', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: new URLSearchParams({
          grant_type: 'urn:ietf:params:oauth:grant-type:jwt-bearer',
          assertion,
        }),
      });

      const json = await res.json() as { access_token?: string };
      return json.access_token ?? null;
    } catch {
      return null;
    }
  }
}
