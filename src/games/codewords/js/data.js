this.window = this.window || {};
(function (exports) {
  'use strict';

  /// <reference path="../../types/language.d.ts" />
  var WordPack;
  (function (WordPack) {
      WordPack["HOMOGRAPHS"] = "Homographs";
      WordPack["INNUENDO"] = "Innuendo";
      WordPack["JOBS"] = "Jobs";
      // Ordered by most used languages
      WordPack["ENGLISH"] = "English";
      WordPack["THAI"] = "\u0E44\u0E17\u0E22";
      WordPack["GERMAN"] = "Deutsch";
      WordPack["FRENCH"] = "Fran\u00E7ais";
      WordPack["SPANISH"] = "Espa\u00F1ol";
      WordPack["RUSSIAN"] = "\u0420\u0443\u0441\u0441\u043A\u0438\u0439";
      WordPack["TURKISH"] = "T\u00FCrk\u00E7e";
      WordPack["DANISH"] = "dansk";
      // Delete these after a while
      WordPack["ORIGINAL"] = "Original";
      WordPack["ORIGINAL_FRENCH"] = "Fran\u00E7ais original";
      WordPack["ORIGINAL_GERMAN"] = "Original Deutsch";
  })(WordPack || (WordPack = {}));
  const metadata = {
      [WordPack.HOMOGRAPHS]: {
          name: WordPack.HOMOGRAPHS,
          description: 'Tricky words with multiple meanings',
          language: 'en',
          length: 890,
      },
      [WordPack.INNUENDO]: {
          name: WordPack.INNUENDO,
          description: 'Innocent words with naughty meanings',
          language: 'en',
          length: 202,
      },
      [WordPack.JOBS]: {
          name: WordPack.JOBS,
          description: 'Occupations, from accountant to zookeeper',
          language: 'en',
          length: 167,
      },
      [WordPack.ENGLISH]: {
          name: WordPack.ENGLISH,
          description: 'Common English words',
          language: 'en',
          length: 400,
      },
      [WordPack.THAI]: {
          name: WordPack.THAI,
          description: 'คำไทยทั่วไป',
          language: 'th',
          length: 400,
      },
      [WordPack.GERMAN]: {
          name: WordPack.GERMAN,
          description: 'Gemeinsame deutsche Wörter',
          language: 'de',
          length: 400,
      },
      [WordPack.FRENCH]: {
          name: WordPack.FRENCH,
          description: 'Mots français courants',
          language: 'fr',
          length: 400,
      },
      [WordPack.SPANISH]: {
          name: WordPack.SPANISH,
          description: 'Palabras simples en español',
          language: 'es',
          length: 400,
      },
      [WordPack.RUSSIAN]: {
          name: WordPack.RUSSIAN,
          description: 'Простые слова на русском',
          language: 'ru',
          length: 683,
      },
      [WordPack.TURKISH]: {
          name: WordPack.TURKISH,
          description: 'Yaygın Türkçe sözcükler',
          language: 'tr',
          length: 400,
      },
      [WordPack.DANISH]: {
          name: WordPack.DANISH,
          description: 'almindelige danske ord',
          language: 'da',
          length: 400,
      },
      [WordPack.ORIGINAL]: {
          name: WordPack.ORIGINAL,
          description: 'Words from the original Codenames',
          language: 'en',
          length: 400,
      },
      [WordPack.ORIGINAL_FRENCH]: {
          name: WordPack.ORIGINAL_FRENCH,
          description: 'Mots originaux de Codenames version française',
          language: 'fr',
          length: 344,
      },
      [WordPack.ORIGINAL_GERMAN]: {
          name: WordPack.ORIGINAL_GERMAN,
          description: 'Wörter aus den ursprünglichen Codenames',
          language: 'de',
          length: 799,
      },
  };

  const data = {
      card_num: 25,
      coloured_num: 8,
      civilian_num: 7,
      two_teams_min_players: 4,
      packs: [
          metadata[WordPack.ENGLISH],
          metadata[WordPack.HOMOGRAPHS],
          metadata[WordPack.INNUENDO],
          metadata[WordPack.JOBS],
          // Ordered by most used languages
          metadata[WordPack.THAI],
          metadata[WordPack.GERMAN],
          metadata[WordPack.FRENCH],
          metadata[WordPack.SPANISH],
          metadata[WordPack.RUSSIAN],
          metadata[WordPack.TURKISH],
          metadata[WordPack.DANISH],
      ],
  };

  exports.data = data;

}(this.window.netgames = this.window.netgames || {}));
