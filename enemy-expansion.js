// Eight original creature rigs, each with two separately painted attack sequences.
(()=>{'use strict';
window.EXPANDED_ENEMIES={
  "saltfang": {
    "id": "enemy-v2-saltfang",
    "key": "saltfang",
    "image": "assets/enemy-v2-saltfang.webp?v=0df876498f",
    "frameWidth": 360,
    "frameHeight": 360,
    "sheetWidth": 1024,
    "sheetHeight": 1024,
    "frameRects": [
      {
        "x": 17,
        "y": 51,
        "w": 234,
        "h": 210,
        "dx": 53.187,
        "dy": 118.555,
        "scale": 1.083871
      },
      {
        "x": 273,
        "y": 50,
        "w": 234,
        "h": 211,
        "dx": 53.187,
        "dy": 117.471,
        "scale": 1.083871
      },
      {
        "x": 524,
        "y": 72,
        "w": 246,
        "h": 189,
        "dx": 45.6,
        "dy": 141.316,
        "scale": 1.083871
      },
      {
        "x": 811,
        "y": 10,
        "w": 202,
        "h": 251,
        "dx": 70.529,
        "dy": 74.116,
        "scale": 1.083871
      },
      {
        "x": 15,
        "y": 297,
        "w": 222,
        "h": 224,
        "dx": 51.019,
        "dy": 101.213,
        "scale": 1.083871
      },
      {
        "x": 237,
        "y": 324,
        "w": 284,
        "h": 199,
        "dx": 14.168,
        "dy": 130.477,
        "scale": 1.083871
      },
      {
        "x": 525,
        "y": 334,
        "w": 267,
        "h": 189,
        "dx": 46.684,
        "dy": 141.316,
        "scale": 1.083871
      },
      {
        "x": 804,
        "y": 324,
        "w": 214,
        "h": 199,
        "dx": 62.942,
        "dy": 130.477,
        "scale": 1.083871
      },
      {
        "x": 32,
        "y": 545,
        "w": 217,
        "h": 213,
        "dx": 69.445,
        "dy": 112.052,
        "scale": 1.083871
      },
      {
        "x": 259,
        "y": 558,
        "w": 263,
        "h": 202,
        "dx": 38.013,
        "dy": 126.142,
        "scale": 1.083871
      },
      {
        "x": 534,
        "y": 571,
        "w": 252,
        "h": 190,
        "dx": 56.439,
        "dy": 140.232,
        "scale": 1.083871
      },
      {
        "x": 811,
        "y": 567,
        "w": 203,
        "h": 193,
        "dx": 70.529,
        "dy": 135.897,
        "scale": 1.083871
      },
      {
        "x": 21,
        "y": 788,
        "w": 221,
        "h": 206,
        "dx": 57.523,
        "dy": 108.8,
        "scale": 1.083871
      },
      {
        "x": 269,
        "y": 778,
        "w": 243,
        "h": 211,
        "dx": 48.852,
        "dy": 97.961,
        "scale": 1.083871
      },
      {
        "x": 523,
        "y": 814,
        "w": 227,
        "h": 186,
        "dx": 44.516,
        "dy": 136.981,
        "scale": 1.083871
      },
      {
        "x": 757,
        "y": 861,
        "w": 262,
        "h": 146,
        "dx": 12.0,
        "dy": 187.923,
        "scale": 1.083871
      }
    ],
    "states": {
      "idle": {
        "frames": [
          0,
          0,
          0,
          1,
          1,
          0
        ],
        "fps": 5,
        "loop": true
      },
      "walk": {
        "frames": [
          0,
          1
        ],
        "fps": 7,
        "loop": true
      },
      "windup": {
        "frames": [
          2,
          3
        ],
        "fps": 5,
        "loop": false
      },
      "attack": {
        "frames": [
          4,
          5,
          6,
          7
        ],
        "fps": 12,
        "releaseFrame": 2,
        "loop": false
      },
      "attackAlt": {
        "frames": [
          8,
          9,
          10,
          11
        ],
        "fps": 12,
        "releaseFrame": 2,
        "loop": false
      },
      "hurt": {
        "frames": [
          12,
          13
        ],
        "fps": 8,
        "loop": false
      },
      "defeat": {
        "frames": [
          14,
          15
        ],
        "fps": 5,
        "loop": false
      }
    }
  },
  "tideglass": {
    "id": "enemy-v2-tideglass",
    "key": "tideglass",
    "image": "assets/enemy-v2-tideglass.webp?v=87858ded07",
    "frameWidth": 360,
    "frameHeight": 360,
    "sheetWidth": 1024,
    "sheetHeight": 1024,
    "frameRects": [
      {
        "x": 15,
        "y": 50,
        "w": 241,
        "h": 221,
        "dx": 40.767,
        "dy": 88.548,
        "scale": 1.150685
      },
      {
        "x": 279,
        "y": 32,
        "w": 233,
        "h": 242,
        "dx": 45.37,
        "dy": 67.836,
        "scale": 1.150685
      },
      {
        "x": 524,
        "y": 66,
        "w": 244,
        "h": 208,
        "dx": 39.616,
        "dy": 106.959,
        "scale": 1.150685
      },
      {
        "x": 774,
        "y": 11,
        "w": 241,
        "h": 263,
        "dx": 41.342,
        "dy": 43.671,
        "scale": 1.150685
      },
      {
        "x": 7,
        "y": 285,
        "w": 243,
        "h": 234,
        "dx": 31.562,
        "dy": 77.041,
        "scale": 1.150685
      },
      {
        "x": 250,
        "y": 321,
        "w": 270,
        "h": 198,
        "dx": 12.0,
        "dy": 118.466,
        "scale": 1.150685
      },
      {
        "x": 520,
        "y": 332,
        "w": 272,
        "h": 187,
        "dx": 35.014,
        "dy": 131.123,
        "scale": 1.150685
      },
      {
        "x": 792,
        "y": 284,
        "w": 225,
        "h": 235,
        "dx": 62.055,
        "dy": 75.89,
        "scale": 1.150685
      },
      {
        "x": 33,
        "y": 534,
        "w": 213,
        "h": 229,
        "dx": 61.479,
        "dy": 79.342,
        "scale": 1.150685
      },
      {
        "x": 262,
        "y": 532,
        "w": 251,
        "h": 231,
        "dx": 25.808,
        "dy": 77.041,
        "scale": 1.150685
      },
      {
        "x": 513,
        "y": 554,
        "w": 279,
        "h": 212,
        "dx": 26.959,
        "dy": 102.356,
        "scale": 1.150685
      },
      {
        "x": 809,
        "y": 542,
        "w": 207,
        "h": 218,
        "dx": 81.616,
        "dy": 88.548,
        "scale": 1.150685
      },
      {
        "x": 31,
        "y": 766,
        "w": 231,
        "h": 234,
        "dx": 59.178,
        "dy": 65.534,
        "scale": 1.150685
      },
      {
        "x": 274,
        "y": 791,
        "w": 238,
        "h": 203,
        "dx": 39.616,
        "dy": 94.301,
        "scale": 1.150685
      },
      {
        "x": 523,
        "y": 801,
        "w": 236,
        "h": 196,
        "dx": 38.466,
        "dy": 105.808,
        "scale": 1.150685
      },
      {
        "x": 759,
        "y": 872,
        "w": 258,
        "h": 138,
        "dx": 24.082,
        "dy": 187.507,
        "scale": 1.150685
      }
    ],
    "states": {
      "idle": {
        "frames": [
          0,
          0,
          0,
          1,
          1,
          0
        ],
        "fps": 5,
        "loop": true
      },
      "walk": {
        "frames": [
          0,
          1
        ],
        "fps": 7,
        "loop": true
      },
      "windup": {
        "frames": [
          2,
          3
        ],
        "fps": 5,
        "loop": false
      },
      "attack": {
        "frames": [
          4,
          5,
          6,
          7
        ],
        "fps": 12,
        "releaseFrame": 2,
        "loop": false
      },
      "attackAlt": {
        "frames": [
          8,
          9,
          10,
          11
        ],
        "fps": 12,
        "releaseFrame": 2,
        "loop": false
      },
      "hurt": {
        "frames": [
          12,
          13
        ],
        "fps": 8,
        "loop": false
      },
      "defeat": {
        "frames": [
          14,
          15
        ],
        "fps": 5,
        "loop": false
      }
    }
  },
  "coral-sentinel": {
    "id": "enemy-v2-coral-sentinel",
    "key": "coral-sentinel",
    "image": "assets/enemy-v2-coral-sentinel.webp?v=0ff16c5ad1",
    "frameWidth": 360,
    "frameHeight": 360,
    "sheetWidth": 1024,
    "sheetHeight": 1024,
    "frameRects": [
      {
        "x": 17,
        "y": 13,
        "w": 239,
        "h": 243,
        "dx": 38.673,
        "dy": 57.827,
        "scale": 1.17284
      },
      {
        "x": 268,
        "y": 17,
        "w": 238,
        "h": 240,
        "dx": 40.432,
        "dy": 62.519,
        "scale": 1.17284
      },
      {
        "x": 513,
        "y": 31,
        "w": 253,
        "h": 228,
        "dx": 31.636,
        "dy": 78.938,
        "scale": 1.17284
      },
      {
        "x": 785,
        "y": 25,
        "w": 235,
        "h": 234,
        "dx": 42.191,
        "dy": 71.901,
        "scale": 1.17284
      },
      {
        "x": 9,
        "y": 277,
        "w": 245,
        "h": 222,
        "dx": 29.29,
        "dy": 84.802,
        "scale": 1.17284
      },
      {
        "x": 254,
        "y": 296,
        "w": 245,
        "h": 204,
        "dx": 24.012,
        "dy": 107.086,
        "scale": 1.17284
      },
      {
        "x": 499,
        "y": 302,
        "w": 280,
        "h": 197,
        "dx": 15.216,
        "dy": 114.123,
        "scale": 1.17284
      },
      {
        "x": 779,
        "y": 273,
        "w": 233,
        "h": 226,
        "dx": 35.154,
        "dy": 80.111,
        "scale": 1.17284
      },
      {
        "x": 20,
        "y": 508,
        "w": 254,
        "h": 255,
        "dx": 42.191,
        "dy": 46.099,
        "scale": 1.17284
      },
      {
        "x": 274,
        "y": 537,
        "w": 244,
        "h": 224,
        "dx": 47.469,
        "dy": 80.111,
        "scale": 1.17284
      },
      {
        "x": 522,
        "y": 570,
        "w": 257,
        "h": 194,
        "dx": 42.191,
        "dy": 118.815,
        "scale": 1.17284
      },
      {
        "x": 781,
        "y": 517,
        "w": 234,
        "h": 245,
        "dx": 37.5,
        "dy": 56.654,
        "scale": 1.17284
      },
      {
        "x": 16,
        "y": 776,
        "w": 246,
        "h": 216,
        "dx": 37.5,
        "dy": 91.84,
        "scale": 1.17284
      },
      {
        "x": 276,
        "y": 772,
        "w": 227,
        "h": 221,
        "dx": 49.815,
        "dy": 87.148,
        "scale": 1.17284
      },
      {
        "x": 506,
        "y": 813,
        "w": 254,
        "h": 175,
        "dx": 23.426,
        "dy": 135.235,
        "scale": 1.17284
      },
      {
        "x": 763,
        "y": 863,
        "w": 257,
        "h": 129,
        "dx": 16.389,
        "dy": 193.877,
        "scale": 1.17284
      }
    ],
    "states": {
      "idle": {
        "frames": [
          0,
          0,
          0,
          1,
          1,
          0
        ],
        "fps": 5,
        "loop": true
      },
      "walk": {
        "frames": [
          0,
          1
        ],
        "fps": 7,
        "loop": true
      },
      "windup": {
        "frames": [
          2,
          3
        ],
        "fps": 5,
        "loop": false
      },
      "attack": {
        "frames": [
          4,
          5,
          6,
          7
        ],
        "fps": 12,
        "releaseFrame": 2,
        "loop": false
      },
      "attackAlt": {
        "frames": [
          8,
          9,
          10,
          11
        ],
        "fps": 12,
        "releaseFrame": 2,
        "loop": false
      },
      "hurt": {
        "frames": [
          12,
          13
        ],
        "fps": 8,
        "loop": false
      },
      "defeat": {
        "frames": [
          14,
          15
        ],
        "fps": 5,
        "loop": false
      }
    }
  },
  "leviathan": {
    "id": "enemy-v2-leviathan",
    "key": "leviathan",
    "image": "assets/enemy-v2-leviathan.webp?v=8cb16a0a6b",
    "frameWidth": 360,
    "frameHeight": 360,
    "sheetWidth": 1024,
    "sheetHeight": 1024,
    "frameRects": [
      {
        "x": 23,
        "y": 28,
        "w": 250,
        "h": 232,
        "dx": 36.0,
        "dy": 81.143,
        "scale": 1.142857
      },
      {
        "x": 275,
        "y": 28,
        "w": 247,
        "h": 232,
        "dx": 37.714,
        "dy": 81.143,
        "scale": 1.142857
      },
      {
        "x": 535,
        "y": 26,
        "w": 240,
        "h": 234,
        "dx": 41.714,
        "dy": 78.857,
        "scale": 1.142857
      },
      {
        "x": 785,
        "y": 6,
        "w": 234,
        "h": 254,
        "dx": 46.286,
        "dy": 56.0,
        "scale": 1.142857
      },
      {
        "x": 20,
        "y": 286,
        "w": 250,
        "h": 214,
        "dx": 32.571,
        "dy": 101.714,
        "scale": 1.142857
      },
      {
        "x": 270,
        "y": 285,
        "w": 249,
        "h": 211,
        "dx": 32.0,
        "dy": 100.571,
        "scale": 1.142857
      },
      {
        "x": 524,
        "y": 284,
        "w": 263,
        "h": 211,
        "dx": 29.143,
        "dy": 99.429,
        "scale": 1.142857
      },
      {
        "x": 791,
        "y": 260,
        "w": 233,
        "h": 239,
        "dx": 53.143,
        "dy": 72.0,
        "scale": 1.142857
      },
      {
        "x": 7,
        "y": 511,
        "w": 272,
        "h": 244,
        "dx": 17.714,
        "dy": 66.286,
        "scale": 1.142857
      },
      {
        "x": 279,
        "y": 522,
        "w": 251,
        "h": 233,
        "dx": 42.286,
        "dy": 78.857,
        "scale": 1.142857
      },
      {
        "x": 531,
        "y": 519,
        "w": 261,
        "h": 237,
        "dx": 37.143,
        "dy": 75.429,
        "scale": 1.142857
      },
      {
        "x": 792,
        "y": 530,
        "w": 229,
        "h": 224,
        "dx": 54.286,
        "dy": 88.0,
        "scale": 1.142857
      },
      {
        "x": 11,
        "y": 760,
        "w": 252,
        "h": 233,
        "dx": 22.286,
        "dy": 73.143,
        "scale": 1.142857
      },
      {
        "x": 271,
        "y": 778,
        "w": 235,
        "h": 218,
        "dx": 33.143,
        "dy": 93.714,
        "scale": 1.142857
      },
      {
        "x": 509,
        "y": 808,
        "w": 267,
        "h": 191,
        "dx": 12.0,
        "dy": 128.0,
        "scale": 1.142857
      },
      {
        "x": 776,
        "y": 853,
        "w": 243,
        "h": 146,
        "dx": 36.0,
        "dy": 179.429,
        "scale": 1.142857
      }
    ],
    "states": {
      "idle": {
        "frames": [
          0,
          0,
          0,
          1,
          1,
          0
        ],
        "fps": 5,
        "loop": true
      },
      "walk": {
        "frames": [
          0,
          1
        ],
        "fps": 7,
        "loop": true
      },
      "windup": {
        "frames": [
          2,
          3
        ],
        "fps": 5,
        "loop": false
      },
      "attack": {
        "frames": [
          4,
          5,
          6,
          7
        ],
        "fps": 12,
        "releaseFrame": 2,
        "loop": false
      },
      "attackAlt": {
        "frames": [
          8,
          9,
          10,
          11
        ],
        "fps": 12,
        "releaseFrame": 2,
        "loop": false
      },
      "hurt": {
        "frames": [
          12,
          13
        ],
        "fps": 8,
        "loop": false
      },
      "defeat": {
        "frames": [
          14,
          15
        ],
        "fps": 5,
        "loop": false
      }
    }
  },
  "crypt-thorn": {
    "id": "enemy-v2-crypt-thorn",
    "key": "crypt-thorn",
    "image": "assets/enemy-v2-crypt-thorn.webp?v=5000b405d7",
    "frameWidth": 360,
    "frameHeight": 360,
    "sheetWidth": 1024,
    "sheetHeight": 1024,
    "frameRects": [
      {
        "x": 34,
        "y": 8,
        "w": 230,
        "h": 261,
        "dx": 57.818,
        "dy": 71.197,
        "scale": 1.053292
      },
      {
        "x": 282,
        "y": 5,
        "w": 240,
        "h": 264,
        "dx": 52.552,
        "dy": 68.038,
        "scale": 1.053292
      },
      {
        "x": 538,
        "y": 30,
        "w": 249,
        "h": 239,
        "dx": 47.812,
        "dy": 94.37,
        "scale": 1.053292
      },
      {
        "x": 810,
        "y": 7,
        "w": 205,
        "h": 262,
        "dx": 72.038,
        "dy": 70.144,
        "scale": 1.053292
      },
      {
        "x": 11,
        "y": 272,
        "w": 253,
        "h": 240,
        "dx": 33.592,
        "dy": 93.317,
        "scale": 1.053292
      },
      {
        "x": 278,
        "y": 275,
        "w": 251,
        "h": 237,
        "dx": 48.339,
        "dy": 96.476,
        "scale": 1.053292
      },
      {
        "x": 529,
        "y": 294,
        "w": 263,
        "h": 218,
        "dx": 38.332,
        "dy": 116.489,
        "scale": 1.053292
      },
      {
        "x": 798,
        "y": 275,
        "w": 221,
        "h": 237,
        "dx": 59.398,
        "dy": 96.476,
        "scale": 1.053292
      },
      {
        "x": 20,
        "y": 542,
        "w": 239,
        "h": 218,
        "dx": 43.072,
        "dy": 112.276,
        "scale": 1.053292
      },
      {
        "x": 277,
        "y": 531,
        "w": 259,
        "h": 231,
        "dx": 47.285,
        "dy": 100.69,
        "scale": 1.053292
      },
      {
        "x": 549,
        "y": 537,
        "w": 243,
        "h": 226,
        "dx": 59.398,
        "dy": 107.009,
        "scale": 1.053292
      },
      {
        "x": 841,
        "y": 526,
        "w": 175,
        "h": 238,
        "dx": 104.69,
        "dy": 95.423,
        "scale": 1.053292
      },
      {
        "x": 9,
        "y": 773,
        "w": 247,
        "h": 224,
        "dx": 31.486,
        "dy": 99.636,
        "scale": 1.053292
      },
      {
        "x": 283,
        "y": 793,
        "w": 228,
        "h": 204,
        "dx": 53.605,
        "dy": 120.702,
        "scale": 1.053292
      },
      {
        "x": 531,
        "y": 807,
        "w": 218,
        "h": 194,
        "dx": 40.439,
        "dy": 135.448,
        "scale": 1.053292
      },
      {
        "x": 753,
        "y": 880,
        "w": 263,
        "h": 127,
        "dx": 12.0,
        "dy": 212.339,
        "scale": 1.053292
      }
    ],
    "states": {
      "idle": {
        "frames": [
          0,
          0,
          0,
          1,
          1,
          0
        ],
        "fps": 5,
        "loop": true
      },
      "walk": {
        "frames": [
          0,
          1
        ],
        "fps": 7,
        "loop": true
      },
      "windup": {
        "frames": [
          2,
          3
        ],
        "fps": 5,
        "loop": false
      },
      "attack": {
        "frames": [
          4,
          5,
          6,
          7
        ],
        "fps": 12,
        "releaseFrame": 2,
        "loop": false
      },
      "attackAlt": {
        "frames": [
          8,
          9,
          10,
          11
        ],
        "fps": 12,
        "releaseFrame": 2,
        "loop": false
      },
      "hurt": {
        "frames": [
          12,
          13
        ],
        "fps": 8,
        "loop": false
      },
      "defeat": {
        "frames": [
          14,
          15
        ],
        "fps": 5,
        "loop": false
      }
    }
  },
  "root-keeper": {
    "id": "enemy-v2-root-keeper",
    "key": "root-keeper",
    "image": "assets/enemy-v2-root-keeper.webp?v=9764cce4bd",
    "frameWidth": 360,
    "frameHeight": 360,
    "sheetWidth": 1024,
    "sheetHeight": 1024,
    "frameRects": [
      {
        "x": 12,
        "y": 81,
        "w": 252,
        "h": 199,
        "dx": 33.361,
        "dy": 116.536,
        "scale": 1.154639
      },
      {
        "x": 266,
        "y": 81,
        "w": 249,
        "h": 199,
        "dx": 35.093,
        "dy": 116.536,
        "scale": 1.154639
      },
      {
        "x": 539,
        "y": 56,
        "w": 237,
        "h": 224,
        "dx": 42.021,
        "dy": 87.67,
        "scale": 1.154639
      },
      {
        "x": 799,
        "y": 8,
        "w": 203,
        "h": 272,
        "dx": 62.804,
        "dy": 32.247,
        "scale": 1.154639
      },
      {
        "x": 9,
        "y": 322,
        "w": 246,
        "h": 206,
        "dx": 29.897,
        "dy": 100.371,
        "scale": 1.154639
      },
      {
        "x": 255,
        "y": 317,
        "w": 281,
        "h": 218,
        "dx": 22.392,
        "dy": 94.598,
        "scale": 1.154639
      },
      {
        "x": 551,
        "y": 348,
        "w": 227,
        "h": 187,
        "dx": 55.876,
        "dy": 130.392,
        "scale": 1.154639
      },
      {
        "x": 798,
        "y": 292,
        "w": 217,
        "h": 237,
        "dx": 61.649,
        "dy": 65.732,
        "scale": 1.154639
      },
      {
        "x": 9,
        "y": 535,
        "w": 256,
        "h": 211,
        "dx": 29.897,
        "dy": 100.371,
        "scale": 1.154639
      },
      {
        "x": 274,
        "y": 547,
        "w": 235,
        "h": 200,
        "dx": 44.33,
        "dy": 114.227,
        "scale": 1.154639
      },
      {
        "x": 514,
        "y": 547,
        "w": 252,
        "h": 201,
        "dx": 13.155,
        "dy": 114.227,
        "scale": 1.154639
      },
      {
        "x": 779,
        "y": 535,
        "w": 234,
        "h": 212,
        "dx": 39.711,
        "dy": 100.371,
        "scale": 1.154639
      },
      {
        "x": 16,
        "y": 755,
        "w": 262,
        "h": 228,
        "dx": 37.979,
        "dy": 74.969,
        "scale": 1.154639
      },
      {
        "x": 282,
        "y": 783,
        "w": 217,
        "h": 200,
        "dx": 53.567,
        "dy": 107.299,
        "scale": 1.154639
      },
      {
        "x": 513,
        "y": 811,
        "w": 242,
        "h": 172,
        "dx": 12.0,
        "dy": 139.629,
        "scale": 1.154639
      },
      {
        "x": 764,
        "y": 853,
        "w": 248,
        "h": 137,
        "dx": 22.392,
        "dy": 188.124,
        "scale": 1.154639
      }
    ],
    "states": {
      "idle": {
        "frames": [
          0,
          0,
          0,
          1,
          1,
          0
        ],
        "fps": 5,
        "loop": true
      },
      "walk": {
        "frames": [
          0,
          1
        ],
        "fps": 7,
        "loop": true
      },
      "windup": {
        "frames": [
          2,
          3
        ],
        "fps": 5,
        "loop": false
      },
      "attack": {
        "frames": [
          4,
          5,
          6,
          7
        ],
        "fps": 12,
        "releaseFrame": 2,
        "loop": false
      },
      "attackAlt": {
        "frames": [
          8,
          9,
          10,
          11
        ],
        "fps": 12,
        "releaseFrame": 2,
        "loop": false
      },
      "hurt": {
        "frames": [
          12,
          13
        ],
        "fps": 8,
        "loop": false
      },
      "defeat": {
        "frames": [
          14,
          15
        ],
        "fps": 5,
        "loop": false
      }
    }
  },
  "crystal-warden": {
    "id": "enemy-v2-crystal-warden",
    "key": "crystal-warden",
    "image": "assets/enemy-v2-crystal-warden.webp?v=a369e41e16",
    "frameWidth": 360,
    "frameHeight": 360,
    "sheetWidth": 1024,
    "sheetHeight": 1024,
    "frameRects": [
      {
        "x": 13,
        "y": 31,
        "w": 244,
        "h": 229,
        "dx": 37.49,
        "dy": 80.993,
        "scale": 1.158621
      },
      {
        "x": 265,
        "y": 30,
        "w": 244,
        "h": 230,
        "dx": 38.648,
        "dy": 79.834,
        "scale": 1.158621
      },
      {
        "x": 514,
        "y": 48,
        "w": 263,
        "h": 212,
        "dx": 26.483,
        "dy": 100.69,
        "scale": 1.158621
      },
      {
        "x": 777,
        "y": 7,
        "w": 235,
        "h": 253,
        "dx": 45.021,
        "dy": 53.186,
        "scale": 1.158621
      },
      {
        "x": 10,
        "y": 285,
        "w": 232,
        "h": 216,
        "dx": 34.014,
        "dy": 96.055,
        "scale": 1.158621
      },
      {
        "x": 242,
        "y": 297,
        "w": 263,
        "h": 203,
        "dx": 12.0,
        "dy": 109.959,
        "scale": 1.158621
      },
      {
        "x": 505,
        "y": 307,
        "w": 279,
        "h": 193,
        "dx": 16.055,
        "dy": 121.545,
        "scale": 1.158621
      },
      {
        "x": 793,
        "y": 286,
        "w": 223,
        "h": 215,
        "dx": 63.559,
        "dy": 97.214,
        "scale": 1.158621
      },
      {
        "x": 17,
        "y": 504,
        "w": 236,
        "h": 255,
        "dx": 42.124,
        "dy": 50.869,
        "scale": 1.158621
      },
      {
        "x": 276,
        "y": 551,
        "w": 233,
        "h": 207,
        "dx": 51.393,
        "dy": 105.324,
        "scale": 1.158621
      },
      {
        "x": 523,
        "y": 570,
        "w": 245,
        "h": 188,
        "dx": 36.91,
        "dy": 127.338,
        "scale": 1.158621
      },
      {
        "x": 771,
        "y": 540,
        "w": 248,
        "h": 218,
        "dx": 38.069,
        "dy": 92.579,
        "scale": 1.158621
      },
      {
        "x": 19,
        "y": 777,
        "w": 234,
        "h": 219,
        "dx": 44.441,
        "dy": 84.469,
        "scale": 1.158621
      },
      {
        "x": 261,
        "y": 790,
        "w": 233,
        "h": 205,
        "dx": 34.014,
        "dy": 99.531,
        "scale": 1.158621
      },
      {
        "x": 505,
        "y": 819,
        "w": 239,
        "h": 177,
        "dx": 16.055,
        "dy": 133.131,
        "scale": 1.158621
      },
      {
        "x": 750,
        "y": 882,
        "w": 266,
        "h": 121,
        "dx": 13.738,
        "dy": 206.124,
        "scale": 1.158621
      }
    ],
    "states": {
      "idle": {
        "frames": [
          0,
          0,
          0,
          1,
          1,
          0
        ],
        "fps": 5,
        "loop": true
      },
      "walk": {
        "frames": [
          0,
          1
        ],
        "fps": 7,
        "loop": true
      },
      "windup": {
        "frames": [
          2,
          3
        ],
        "fps": 5,
        "loop": false
      },
      "attack": {
        "frames": [
          4,
          5,
          6,
          7
        ],
        "fps": 12,
        "releaseFrame": 2,
        "loop": false
      },
      "attackAlt": {
        "frames": [
          8,
          9,
          10,
          11
        ],
        "fps": 12,
        "releaseFrame": 2,
        "loop": false
      },
      "hurt": {
        "frames": [
          12,
          13
        ],
        "fps": 8,
        "loop": false
      },
      "defeat": {
        "frames": [
          14,
          15
        ],
        "fps": 5,
        "loop": false
      }
    }
  },
  "reef-warden": {
    "id": "enemy-v2-reef-warden",
    "key": "reef-warden",
    "image": "assets/enemy-v2-reef-warden.webp?v=196d19cf34",
    "frameWidth": 360,
    "frameHeight": 360,
    "sheetWidth": 1024,
    "sheetHeight": 1024,
    "frameRects": [
      {
        "x": 25,
        "y": 23,
        "w": 218,
        "h": 257,
        "dx": 59.125,
        "dy": 61.218,
        "scale": 1.108949
      },
      {
        "x": 272,
        "y": 23,
        "w": 220,
        "h": 257,
        "dx": 58.016,
        "dy": 61.218,
        "scale": 1.108949
      },
      {
        "x": 515,
        "y": 60,
        "w": 251,
        "h": 220,
        "dx": 40.827,
        "dy": 102.249,
        "scale": 1.108949
      },
      {
        "x": 812,
        "y": 9,
        "w": 200,
        "h": 271,
        "dx": 69.105,
        "dy": 45.693,
        "scale": 1.108949
      },
      {
        "x": 13,
        "y": 294,
        "w": 245,
        "h": 224,
        "dx": 45.817,
        "dy": 97.813,
        "scale": 1.108949
      },
      {
        "x": 258,
        "y": 325,
        "w": 275,
        "h": 193,
        "dx": 42.49,
        "dy": 132.191,
        "scale": 1.108949
      },
      {
        "x": 533,
        "y": 343,
        "w": 258,
        "h": 175,
        "dx": 60.788,
        "dy": 152.152,
        "scale": 1.108949
      },
      {
        "x": 800,
        "y": 306,
        "w": 213,
        "h": 212,
        "dx": 55.798,
        "dy": 111.121,
        "scale": 1.108949
      },
      {
        "x": 22,
        "y": 543,
        "w": 231,
        "h": 199,
        "dx": 55.798,
        "dy": 124.428,
        "scale": 1.108949
      },
      {
        "x": 253,
        "y": 543,
        "w": 275,
        "h": 197,
        "dx": 36.946,
        "dy": 124.428,
        "scale": 1.108949
      },
      {
        "x": 543,
        "y": 553,
        "w": 248,
        "h": 190,
        "dx": 71.877,
        "dy": 135.518,
        "scale": 1.108949
      },
      {
        "x": 810,
        "y": 547,
        "w": 198,
        "h": 196,
        "dx": 66.887,
        "dy": 128.864,
        "scale": 1.108949
      },
      {
        "x": 9,
        "y": 758,
        "w": 250,
        "h": 229,
        "dx": 41.381,
        "dy": 64.545,
        "scale": 1.108949
      },
      {
        "x": 302,
        "y": 788,
        "w": 198,
        "h": 197,
        "dx": 91.284,
        "dy": 97.813,
        "scale": 1.108949
      },
      {
        "x": 533,
        "y": 749,
        "w": 222,
        "h": 240,
        "dx": 60.788,
        "dy": 54.564,
        "scale": 1.108949
      },
      {
        "x": 762,
        "y": 854,
        "w": 255,
        "h": 158,
        "dx": 13.658,
        "dy": 171.004,
        "scale": 1.108949
      }
    ],
    "states": {
      "idle": {
        "frames": [
          0,
          0,
          0,
          1,
          1,
          0
        ],
        "fps": 5,
        "loop": true
      },
      "walk": {
        "frames": [
          0,
          1
        ],
        "fps": 7,
        "loop": true
      },
      "windup": {
        "frames": [
          2,
          3
        ],
        "fps": 5,
        "loop": false
      },
      "attack": {
        "frames": [
          4,
          5,
          6,
          7
        ],
        "fps": 12,
        "releaseFrame": 2,
        "loop": false
      },
      "attackAlt": {
        "frames": [
          8,
          9,
          10,
          11
        ],
        "fps": 12,
        "releaseFrame": 2,
        "loop": false
      },
      "hurt": {
        "frames": [
          12,
          13
        ],
        "fps": 8,
        "loop": false
      },
      "defeat": {
        "frames": [
          14,
          15
        ],
        "fps": 5,
        "loop": false
      }
    }
  }
};
const styles={saltfang:[['Cutlass slash','Buckler bash'],['claw','hammer']],tideglass:[['Barnacle-staff thrust','Tideglass lantern bolt'],['claw','enemy-spell']],'coral-sentinel':[['Coral claw','Reef-shattering slam'],['claw','hammer']],leviathan:[['Storm talons','Lantern breath'],['claw','enemy-spell']],'crypt-thorn':[['Thornblade slash','Root-shield bash'],['claw','hammer']],'root-keeper':[['Root-maul crush','Emerald shield strike'],['hammer','claw']],'crystal-warden':[['Quartz punch','Crystal avalanche'],['claw','hammer']],'reef-warden':[['Coral trident','Shell sweep'],['claw','hammer']]};for(const [key,[names,effects]]of Object.entries(styles)){EXPANDED_ENEMIES[key].attackNames=names;EXPANDED_ENEMIES[key].attackEffects=effects;}
Object.assign(ENEMY_ANIMATIONS,EXPANDED_ENEMIES);
const byNode={'crypt-sentinel':'crypt-thorn','crypt-guardian':'root-keeper',mine:'crystal-warden',reef:'reef-warden'},byIndex={12:'saltfang',13:'tideglass',14:'coral-sentinel',15:'leviathan'},resolve=EnemyRoster.resolve;
for(const [index,key]of Object.entries(byIndex))EnemyRoster.keys[Number(index)]=key;
EnemyRoster.resolve=function(index,node){const key=byNode[node]||byIndex[index];return key?{...EXPANDED_ENEMIES[key],id:'battle-enemy',key}:resolve.call(this,index,node);};
for(let i=0;i<HEROES.length;i++){const clip=HEROES[i].states.attack;clip.releaseFrame=Math.min(i===0?3:2,clip.frames.length-1);}
})();

// Encounter-specific forge supplies supplement existing one-time trophies.
window.CityLoot={drops:{m8:{name:'Thornsteel fragments',runes:2,potions:0},m9:{name:'Librarian’s rune pages',runes:3,potions:0},m10:{name:'Tempered ember cores',runes:3,potions:1},vault:{name:'Gilded vault cache',runes:4,potions:2},m11:{name:'Restored dawn crystals',runes:5,potions:2}},collect(s,id){const d=this.drops[id];if(!d)return '';s.campaign.runes=Math.min(999,s.campaign.runes+d.runes);s.campaign.potions=Math.min(99,s.campaign.potions+d.potions);s.treasure.push(d.name);return d.name+' · +'+d.runes+' forge runes'+(d.potions?' · +'+d.potions+' healing potions':'');}};

// Asterfall's five distinct creatures, loaded only for their encounter.
(()=>{'use strict';
window.CityEnemies={rigs:{"thorn-knight":{"id":"enemy-city-thorn-knight","key":"thorn-knight","image":"assets/enemy-city-thorn-knight.webp?v=cd905bb051","frameWidth":360,"frameHeight":360,"sheetWidth":1024,"sheetHeight":1024,"frameRects":[{"x":29,"y":38,"w":232,"h":228,"dx":42.545,"dy":78.49,"scale":1.174825},{"x":267,"y":43,"w":248,"h":223,"dx":33.147,"dy":84.364,"scale":1.174825},{"x":526,"y":59,"w":248,"h":207,"dx":33.147,"dy":103.161,"scale":1.174825},{"x":782,"y":12,"w":235,"h":254,"dx":41.958,"dy":47.944,"scale":1.174825},{"x":11,"y":309,"w":257,"h":202,"dx":21.399,"dy":107.86,"scale":1.174825},{"x":274,"y":318,"w":243,"h":194,"dx":41.371,"dy":118.434,"scale":1.174825},{"x":517,"y":339,"w":272,"h":173,"dx":22.573,"dy":143.105,"scale":1.174825},{"x":793,"y":318,"w":224,"h":194,"dx":54.881,"dy":118.434,"scale":1.174825},{"x":28,"y":563,"w":233,"h":190,"dx":41.371,"dy":121.958,"scale":1.174825},{"x":267,"y":554,"w":268,"h":198,"dx":33.147,"dy":111.385,"scale":1.174825},{"x":550,"y":562,"w":242,"h":192,"dx":61.343,"dy":120.783,"scale":1.174825},{"x":807,"y":547,"w":211,"h":203,"dx":71.329,"dy":103.161,"scale":1.174825},{"x":48,"y":768,"w":215,"h":227,"dx":64.867,"dy":66.741,"scale":1.174825},{"x":284,"y":800,"w":230,"h":195,"dx":53.119,"dy":104.336,"scale":1.174825},{"x":531,"y":831,"w":226,"h":171,"dx":39.021,"dy":140.755,"scale":1.174825},{"x":762,"y":897,"w":256,"h":109,"dx":18.462,"dy":218.294,"scale":1.174825}],"states":{"idle":{"frames":[0,0,0,1,1,0],"fps":5,"loop":true},"walk":{"frames":[0,1],"fps":7,"loop":true},"windup":{"frames":[2,3],"fps":5,"loop":false},"attack":{"frames":[4,5,6,7],"fps":12,"releaseFrame":2,"loop":false},"attackAlt":{"frames":[8,9,10,11],"fps":12,"releaseFrame":2,"loop":false},"hurt":{"frames":[12,13],"fps":8,"loop":false},"defeat":{"frames":[14,15],"fps":5,"loop":false}},"attackNames":["Thorn rapier","Barbed shield bash"],"attackEffects":["claw","hammer"]},"shadow-specter":{"id":"enemy-city-shadow-specter","key":"shadow-specter","image":"assets/enemy-city-shadow-specter.webp?v=2883ca2c0a","frameWidth":360,"frameHeight":360,"sheetWidth":1024,"sheetHeight":1024,"frameRects":[{"x":22,"y":20,"w":236,"h":251,"dx":45.417,"dy":62.393,"scale":1.130952},{"x":277,"y":19,"w":240,"h":252,"dx":43.155,"dy":61.262,"scale":1.130952},{"x":541,"y":35,"w":229,"h":236,"dx":49.375,"dy":79.357,"scale":1.130952},{"x":786,"y":10,"w":232,"h":261,"dx":48.81,"dy":51.083,"scale":1.130952},{"x":19,"y":288,"w":235,"h":225,"dx":42.024,"dy":89.536,"scale":1.130952},{"x":254,"y":302,"w":265,"h":209,"dx":17.143,"dy":105.369,"scale":1.130952},{"x":519,"y":310,"w":268,"h":205,"dx":24.494,"dy":114.417,"scale":1.130952},{"x":787,"y":295,"w":226,"h":220,"dx":49.94,"dy":97.452,"scale":1.130952},{"x":24,"y":526,"w":234,"h":238,"dx":47.679,"dy":74.833,"scale":1.130952},{"x":275,"y":517,"w":253,"h":249,"dx":40.893,"dy":64.655,"scale":1.130952},{"x":528,"y":528,"w":255,"h":236,"dx":34.673,"dy":77.095,"scale":1.130952},{"x":826,"y":529,"w":187,"h":232,"dx":94.048,"dy":78.226,"scale":1.130952},{"x":20,"y":782,"w":243,"h":222,"dx":43.155,"dy":92.929,"scale":1.130952},{"x":279,"y":766,"w":244,"h":240,"dx":45.417,"dy":74.833,"scale":1.130952},{"x":532,"y":817,"w":240,"h":180,"dx":39.196,"dy":132.512,"scale":1.130952},{"x":777,"y":879,"w":238,"h":121,"dx":38.631,"dy":202.631,"scale":1.130952}],"states":{"idle":{"frames":[0,0,0,1,1,0],"fps":5,"loop":true},"walk":{"frames":[0,1],"fps":7,"loop":true},"windup":{"frames":[2,3],"fps":5,"loop":false},"attack":{"frames":[4,5,6,7],"fps":12,"releaseFrame":2,"loop":false},"attackAlt":{"frames":[8,9,10,11],"fps":12,"releaseFrame":2,"loop":false},"hurt":{"frames":[12,13],"fps":8,"loop":false},"defeat":{"frames":[14,15],"fps":5,"loop":false}},"attackNames":["Spectral rake","Forbidden-page volley"],"attackEffects":["claw","enemy-spell"]},"ember-sentinel":{"id":"enemy-city-ember-sentinel","key":"ember-sentinel","image":"assets/enemy-city-ember-sentinel.webp?v=80d8c2057a","frameWidth":360,"frameHeight":360,"sheetWidth":1024,"sheetHeight":1024,"frameRects":[{"x":4,"y":73,"w":246,"h":183,"dx":52.05,"dy":155.715,"scale":1.040248},{"x":262,"y":73,"w":246,"h":183,"dx":52.05,"dy":155.715,"scale":1.040248},{"x":546,"y":11,"w":217,"h":245,"dx":67.133,"dy":91.22,"scale":1.040248},{"x":807,"y":4,"w":213,"h":252,"dx":69.214,"dy":83.938,"scale":1.040248},{"x":40,"y":257,"w":214,"h":264,"dx":89.498,"dy":71.455,"scale":1.040248},{"x":296,"y":261,"w":221,"h":260,"dx":87.418,"dy":75.616,"scale":1.040248},{"x":519,"y":348,"w":249,"h":173,"dx":39.046,"dy":166.118,"scale":1.040248},{"x":776,"y":346,"w":246,"h":175,"dx":36.966,"dy":164.037,"scale":1.040248},{"x":8,"y":562,"w":248,"h":193,"dx":56.211,"dy":144.272,"scale":1.040248},{"x":262,"y":572,"w":273,"h":183,"dx":52.05,"dy":154.675,"scale":1.040248},{"x":538,"y":565,"w":254,"h":190,"dx":58.811,"dy":147.393,"scale":1.040248},{"x":801,"y":565,"w":214,"h":191,"dx":62.972,"dy":147.393,"scale":1.040248},{"x":10,"y":798,"w":242,"h":197,"dx":58.291,"dy":131.789,"scale":1.040248},{"x":256,"y":787,"w":252,"h":209,"dx":45.808,"dy":120.347,"scale":1.040248},{"x":524,"y":818,"w":214,"h":180,"dx":44.248,"dy":152.594,"scale":1.040248},{"x":752,"y":877,"w":268,"h":127,"dx":12,"dy":213.969,"scale":1.040248}],"states":{"idle":{"frames":[0,0,0,1,1,0],"fps":5,"loop":true},"walk":{"frames":[0,1],"fps":7,"loop":true},"windup":{"frames":[2,3],"fps":5,"loop":false},"attack":{"frames":[4,5,6,7],"fps":12,"releaseFrame":2,"loop":false},"attackAlt":{"frames":[8,9,10,11],"fps":12,"releaseFrame":2,"loop":false},"hurt":{"frames":[12,13],"fps":8,"loop":false},"defeat":{"frames":[14,15],"fps":5,"loop":false}},"attackNames":["Furnace hammer","Corefire burst"],"attackEffects":["hammer","enemy-spell"]},"nightroot-city":{"id":"enemy-city-nightroot-city","key":"nightroot-city","image":"assets/enemy-city-nightroot-city.webp?v=5f6198ee75","frameWidth":360,"frameHeight":360,"sheetWidth":1024,"sheetHeight":1024,"frameRects":[{"x":12,"y":14,"w":244,"h":260,"dx":46.269,"dy":61.192,"scale":1.096154},{"x":284,"y":20,"w":227,"h":254,"dx":55.587,"dy":67.769,"scale":1.096154},{"x":537,"y":37,"w":244,"h":237,"dx":45.173,"dy":86.404,"scale":1.096154},{"x":793,"y":5,"w":227,"h":269,"dx":55.587,"dy":51.327,"scale":1.096154},{"x":12,"y":292,"w":235,"h":218,"dx":46.269,"dy":107.231,"scale":1.096154},{"x":265,"y":295,"w":250,"h":214,"dx":34.76,"dy":110.519,"scale":1.096154},{"x":515,"y":299,"w":265,"h":210,"dx":21.058,"dy":114.904,"scale":1.096154},{"x":780,"y":294,"w":243,"h":215,"dx":41.337,"dy":109.423,"scale":1.096154},{"x":23,"y":538,"w":233,"h":228,"dx":58.327,"dy":95.173,"scale":1.096154},{"x":277,"y":515,"w":248,"h":252,"dx":47.913,"dy":69.962,"scale":1.096154},{"x":537,"y":512,"w":239,"h":255,"dx":45.173,"dy":66.673,"scale":1.096154},{"x":780,"y":552,"w":241,"h":215,"dx":41.337,"dy":110.519,"scale":1.096154},{"x":37,"y":779,"w":219,"h":219,"dx":73.673,"dy":102.846,"scale":1.096154},{"x":274,"y":782,"w":243,"h":215,"dx":44.625,"dy":106.135,"scale":1.096154},{"x":527,"y":820,"w":234,"h":174,"dx":34.212,"dy":147.788,"scale":1.096154},{"x":761,"y":874,"w":261,"h":127,"dx":20.51,"dy":206.981,"scale":1.096154}],"states":{"idle":{"frames":[0,0,0,1,1,0],"fps":5,"loop":true},"walk":{"frames":[0,1],"fps":7,"loop":true},"windup":{"frames":[2,3],"fps":5,"loop":false},"attack":{"frames":[4,5,6,7],"fps":12,"releaseFrame":2,"loop":false},"attackAlt":{"frames":[8,9,10,11],"fps":12,"releaseFrame":2,"loop":false},"hurt":{"frames":[12,13],"fps":8,"loop":false},"defeat":{"frames":[14,15],"fps":5,"loop":false}},"attackNames":["Siphoning vine","Eclipse bloom"],"attackEffects":["claw","enemy-spell"]},"vault-knight":{"id":"enemy-city-vault-knight","key":"vault-knight","image":"assets/enemy-city-vault-knight.webp?v=a591ef851a","frameWidth":360,"frameHeight":360,"sheetWidth":1024,"sheetHeight":1024,"frameRects":[{"x":8,"y":70,"w":248,"h":194,"dx":32.704,"dy":116.845,"scale":1.183099},{"x":262,"y":70,"w":252,"h":194,"dx":29.746,"dy":116.845,"scale":1.183099},{"x":527,"y":86,"w":250,"h":178,"dx":30.93,"dy":135.775,"scale":1.183099},{"x":785,"y":28,"w":232,"h":236,"dx":42.761,"dy":67.155,"scale":1.183099},{"x":17,"y":295,"w":235,"h":207,"dx":43.352,"dy":101.465,"scale":1.183099},{"x":253,"y":320,"w":278,"h":182,"dx":19.099,"dy":131.042,"scale":1.183099},{"x":533,"y":322,"w":256,"h":180,"dx":38.028,"dy":133.408,"scale":1.183099},{"x":789,"y":314,"w":235,"h":188,"dx":47.493,"dy":123.944,"scale":1.183099},{"x":7,"y":586,"w":259,"h":164,"dx":31.521,"dy":151.155,"scale":1.183099},{"x":273,"y":584,"w":251,"h":167,"dx":42.761,"dy":148.789,"scale":1.183099},{"x":530,"y":595,"w":251,"h":156,"dx":34.479,"dy":161.803,"scale":1.183099},{"x":781,"y":568,"w":241,"h":182,"dx":38.028,"dy":129.859,"scale":1.183099},{"x":14,"y":789,"w":235,"h":209,"dx":39.803,"dy":94.366,"scale":1.183099},{"x":263,"y":774,"w":246,"h":225,"dx":30.93,"dy":76.62,"scale":1.183099},{"x":515,"y":830,"w":244,"h":170,"dx":16.732,"dy":142.873,"scale":1.183099},{"x":767,"y":873,"w":257,"h":129,"dx":21.465,"dy":193.746,"scale":1.183099}],"states":{"idle":{"frames":[0,0,0,1,1,0],"fps":5,"loop":true},"walk":{"frames":[0,1],"fps":7,"loop":true},"windup":{"frames":[2,3],"fps":5,"loop":false},"attack":{"frames":[4,5,6,7],"fps":12,"releaseFrame":2,"loop":false},"attackAlt":{"frames":[8,9,10,11],"fps":12,"releaseFrame":2,"loop":false},"hurt":{"frames":[12,13],"fps":8,"loop":false},"defeat":{"frames":[14,15],"fps":5,"loop":false}},"attackNames":["Clockwork pincer","Gilded shell ram"],"attackEffects":["claw","hammer"]}},details:{"thorn-knight":{"names":["Thorn rapier","Barbed shield bash"],"effects":["claw","hammer"],"actions":["parry","dodge","block"],"weak":"blunt","resist":"piercing","trait":"Interlocking thorn plate","hint":"Brom breaks the plate. Parry the rapier, sidestep the shield, duck its return sweep."},"shadow-specter":{"names":["Spectral rake","Forbidden-page volley"],"effects":["claw","enemy-spell"],"actions":["dodge","parry","block"],"weak":"fire","resist":"axe","trait":"Incorporeal librarian","hint":"Seren burns its shadow form. Dodge the reaching hand and parry the book’s bolts."},"ember-sentinel":{"names":["Furnace hammer","Corefire burst"],"effects":["hammer","enemy-spell"],"actions":["jump","dodge","parry"],"weak":"axe","resist":"fire","trait":"Overheated furnace shell","hint":"Thorin opens the shell; fire feeds its furnace. Jump the ground strike and dodge the core burst."},"nightroot-city":{"names":["Siphoning vine","Eclipse bloom"],"effects":["claw","enemy-spell"],"actions":["parry","dodge","block"]},"vault-knight":{"names":["Clockwork pincer","Gilded shell ram"],"effects":["claw","hammer"],"actions":["parry","jump","dodge"],"weak":"blunt","resist":"piercing","trait":"Gilded clockwork shell","hint":"Brom cracks the shell. Parry its pincers, jump the low sweep, then dodge the ram."}},byNode:{m8:'thorn-knight',m9:'shadow-specter',m10:'ember-sentinel',m11:'nightroot-city',vault:'vault-knight'}};
const city=CityEnemies,prior=EnemyRoster.resolve;Object.assign(ENEMY_ANIMATIONS,city.rigs);for(const [index,key]of [[8,'thorn-knight'],[9,'shadow-specter'],[10,'ember-sentinel'],[11,'nightroot-city']])EnemyRoster.keys[index]=key;EnemyRoster.resolve=function(index,node){const key=city.byNode[node]||(index>=8&&index<=11?EnemyRoster.keys[index]:null);return key?{...city.rigs[key],id:'battle-enemy',key}:prior.call(this,index,node);};
const pattern=DefenseRules.pattern;DefenseRules.pattern=function(index,turn,effect,node){const base=pattern.call(this,index,turn,effect),key=city.byNode[node]||(index>=8&&index<=10?EnemyRoster.keys[index]:null),d=city.details[key];if(!d)return base;const offset=turn%2===0?1:0;return {...base,actions:base.actions.map((_,i)=>d.actions[(i+offset)%d.actions.length]),name:d.names[turn%2===0?1:0]};};
const profile=TacticalRules.profile;TacticalRules.profile=function(index,node,hp,max){const key=city.byNode[node]||(index>=8&&index<=10?EnemyRoster.keys[index]:null),d=city.details[key];return d?.weak?{weak:d.weak,resist:d.resist,armor:false,name:d.trait,hint:d.hint}:profile.call(this,index,node,hp,max);};
const plan=BossRules.plan;BossRules.plan=function(s,e,base){const p=plan.call(this,s,e,base);return p.bossId==='m11'?{...p,attackVariant:p.kind==='lash'?false:true}:p;};
for(const [id,key]of Object.entries(city.byNode)){const d=city.details[key],tale=FOREST_STORY.areas[id];if(tale&&d.hint)tale.danger=d.hint+' Watch the directional cue and react while it is lit.';}
})();
