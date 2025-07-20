import { Component, OnDestroy } from '@angular/core';
import * as SunCalc from 'suncalc';
import { LyrickModel } from './models/lyric.model';
import { DatePipe } from '@angular/common';

declare module 'suncalc' {
  export interface SunTimes {
    sunrise: Date;
    sunset: Date;
    [key: string]: Date;
  }

  export function getTimes(date: Date, latitude: number, longitude: number): SunTimes;
}

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  imports:[DatePipe],
  styleUrls: ['./app.component.css'],
  standalone:true
})
export class AppComponent implements OnDestroy {
  timeRemaining: string = '';
  lyric: string = '';
  private timerId: any;
  private previousLyricIndex: number = -1;
  nowDate = new Date();

  // İstanbul Pendik koordinatları
  private latitude = 40.8699;
  private longitude = 29.2982;

  constructor() {
    this.pickRandomLyric();
    this.startClock();
  }

  startClock() {
    this.updateTimeRemaining();
    this.timerId = setInterval(() => {
      this.updateTimeRemaining();

      // Her saniye tarih güncelle
      this.nowDate = new Date();
    }, 1000);
  }

  pickRandomLyric() {
    const lyrickModelDatas: LyrickModel[] = [
  { id: 1, lyric: "An'a odaklan" },
  { id: 2, lyric: "Güneş yeniden doğacak" },
  { id: 3, lyric: "Bugün batarsa güneş yarın yeniden doğar güneş" },
  { id: 4, lyric: "Her karanlık gecenin bir sabahı vardır" },
  { id: 5, lyric: "Umudunu kaybetme, yeni bir gün doğuyor" },
  { id: 6, lyric: "Hayat, yeniden başlamak için her zaman bir fırsattır" },
  { id: 7, lyric: "Gözlerini gökyüzüne dik, yıldızlar kadar parlak ol" },
  { id: 8, lyric: "Adımların seni nereye götürürse götürsün, cesur ol" },
  { id: 9, lyric: "Düşlerin peşinden git, güneş gibi parılda" },
  { id: 10, lyric: "Her yeni gün, yeni umutlarla gelir" },
  { id: 11, lyric: "Karanlık geçer, aydınlık kalır" },
  { id: 12, lyric: "İnandığın sürece yolun bitmez" },
  { id: 13, lyric: "Güneş doğunca her şey mümkün" },
  { id: 14, lyric: "Sabahın ışığı umutla doludur" },
  { id: 15, lyric: "Kalbinin sesini dinle, yolunu bul" },
  { id: 16, lyric: "Her gün yeni bir başlangıçtır" },
  { id: 17, lyric: "Yolun sonu ışıkla dolu" },
  { id: 18, lyric: "Gecenin ardından mutlaka gündüz gelir" },
  { id: 19, lyric: "Güçlü ol, fırtına diner" },
  { id: 20, lyric: "Umudun ışığı karanlığı deler" },
  { id: 21, lyric: "Rüzgar ne kadar sert olsa da yoluna devam et" },
  { id: 22, lyric: "Hayallerin gerçeğe dönüşür" },
  { id: 23, lyric: "Işığa doğru yürümekten vazgeçme" },
  { id: 24, lyric: "Kendine inan, her şey mümkün" },
  { id: 25, lyric: "Sabahın erken saatleri huzurla dolar" },
  { id: 26, lyric: "Güneş doğarken dünya uyanır" },
  { id: 27, lyric: "Yaşam bir yolculuktur, tadını çıkar" },
  { id: 28, lyric: "Her yeni gün yeni umutlar taşır" },
  { id: 29, lyric: "Karanlık çöktüğünde yıldızlar parlar" },
  { id: 30, lyric: "Sonsuzluk umutla başlar" },
  { id: 31, lyric: "Gökyüzü ne kadar bulutlu olsa da güneş orada" },
  { id: 32, lyric: "Sabahın tazeliğini hisset" },
  { id: 33, lyric: "Her adım seni hedefe yaklaştırır" },
  { id: 34, lyric: "Güneşin sıcaklığı ruhunu ısıtsın" },
  { id: 35, lyric: "Geceyi aşan bir ışık ol" },
  { id: 36, lyric: "Kalbini aç, sevgiye yer ver" },
  { id: 37, lyric: "Yeni gün, yeni umutlar getirir" },
  { id: 38, lyric: "Her sabah yeniden doğ" },
  { id: 39, lyric: "Yaşamın güzelliğini keşfet" },
  { id: 40, lyric: "Işık seni her zaman bulur" },
  { id: 41, lyric: "Güneşin doğuşu gibi parlak ol" },
  { id: 42, lyric: "Her zorluk yeni bir güç verir" },
  { id: 43, lyric: "Sabahın sessizliği huzur verir" },
  { id: 44, lyric: "Hayatın ritmine ayak uydur" },
  { id: 45, lyric: "Her yeni gün şansı beraberinde getirir" },
  { id: 46, lyric: "Işığın peşinden git" },
  { id: 47, lyric: "Gökyüzü kadar geniş hayal kur" },
  { id: 48, lyric: "Yeni umutlar yeşersin içinde" },
  { id: 49, lyric: "Kalbinle hisset, yolunu bul" },
  { id: 50, lyric: "Güneş her sabah senin için doğar" }
  ];


    if (lyrickModelDatas.length <= 1) {
      this.lyric = lyrickModelDatas[0]?.lyric || '';
      return;
    }

    let newIndex: number;
    do {
      newIndex = Math.floor(Math.random() * lyrickModelDatas.length);
    } while (newIndex === this.previousLyricIndex);

    this.previousLyricIndex = newIndex;
    this.lyric = lyrickModelDatas[newIndex].lyric;
  }

  updateTimeRemaining() {
  const now = new Date();

  // Bugünün güneş doğuşunu hesapla
  const timesToday = SunCalc.getTimes(now, this.latitude, this.longitude);
  const sunRiseToday = timesToday.sunrise;

  let nextSunRise: Date;

  if (now >= sunRiseToday) {
    // Eğer güneş doğuşu geçtiyse yarının güneş doğuşunu al
    const tomorrow = new Date(now);
    tomorrow.setDate(tomorrow.getDate() + 1);
    const timesTomorrow = SunCalc.getTimes(tomorrow, this.latitude, this.longitude);
    nextSunRise = timesTomorrow.sunrise;
  } else {
    // Güneş doğuşu henüz gelmediyse bugünün doğuşu
    nextSunRise = sunRiseToday;
  }

  const diffMs = nextSunRise.getTime() - now.getTime();

  if (diffMs <= 0) {
    // Olası negatif fark için (çok nadir), 0 göster
    this.timeRemaining = '00:00:00';
    return;
  }

  const totalSeconds = Math.floor(diffMs / 1000);
  const hours = Math.floor(totalSeconds / 3600).toString().padStart(2, '0');
  const minutes = Math.floor((totalSeconds % 3600) / 60).toString().padStart(2, '0');
  const seconds = (totalSeconds % 60).toString().padStart(2, '0');

  this.timeRemaining = `${hours}:${minutes}:${seconds}`;
}

  ngOnDestroy(): void {
    if (this.timerId) {
      clearInterval(this.timerId);
    }
  }
}

