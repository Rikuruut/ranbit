import { AudioPlayer, createAudioPlayer } from 'expo-audio';

// ─────────────────────────────────────────────
//  audio.ts
//
//  旧Flutterでは以下の3ファイルに分かれていた:
//    web_audio.dart          … 条件付きエクスポート(dart.library.js 分岐)
//    web_audio_mobile.dart   … audioplayers パッケージ使用
//    web_audio_web.dart      … dart:js 経由でindex.htmlのJS関数を呼び出し
//
//  expo-audio(SDK55)はweb/iOS/Androidを単一APIで扱うため
//  3ファイルの分岐・条件付きインポートが丸ごと不要になった。
// ─────────────────────────────────────────────

// SEとBGMは独立したプレイヤーで管理(旧 _player / _bgmPlayer に対応)
let sePlayer:  AudioPlayer | null = null;
let bgmPlayer: AudioPlayer | null = null;

// 旧 _currentVolume / _isSeEnabled / _seScale / _bgmScale に対応
let currentVolume = 1.0;
let seEnabled     = true;
const SE_SCALE    = 0.3;
const BGM_SCALE   = 0.3;

/** 音量設定(旧 WebAudioManager.setVolume) */
export function setVolume(volume: number) {
  currentVolume = volume;
  if (sePlayer)  sePlayer.volume  = volume * SE_SCALE;
  if (bgmPlayer) bgmPlayer.volume = volume * BGM_SCALE;
}

/** SE有効/無効切り替え(旧 WebAudioManager.setSeEnabled) */
export function setSeEnabled(enabled: boolean) {
  seEnabled = enabled;
}

/** SE再生(旧 WebAudioManager.play) */
export async function playSe(filename: string) {
  if (!seEnabled) return;
  try {
    sePlayer?.remove();
    sePlayer = createAudioPlayer(require(`../assets/sounds/${filename}`));
    sePlayer.volume = currentVolume * SE_SCALE;
    sePlayer.play();
  } catch (e) {
    console.warn('[audio] SE再生エラー:', e);
  }
}

/** BGM再生(旧 WebAudioManager.playBgm) */
export async function playBgm(filename: string) {
  if (!filename) return;
  try {
    bgmPlayer?.remove();
    bgmPlayer = createAudioPlayer(require(`../assets/sounds/${filename}`));
    bgmPlayer.volume = currentVolume * BGM_SCALE;
    bgmPlayer.loop   = true;
    bgmPlayer.play();
  } catch (e) {
    console.warn('[audio] BGM再生エラー:', e);
  }
}

/** BGM停止(旧 WebAudioManager.stopBgm) */
export function stopBgm() {
  bgmPlayer?.remove();
  bgmPlayer = null;
}