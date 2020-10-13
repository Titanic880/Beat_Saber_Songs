const fs = require('fs');
const baseBPM = 150;
const noteJumpSpeed = 10;
const defaultObj = {
  _version: '1.5.0',
  _beatsPerMinute: baseBPM,
  _beatsPerBar: 16,
  _noteJumpSpeed: noteJumpSpeed,
  _shuffle: 0,
  _shufflePeriod: 0.5,
  _events: [],
  _notes: [],
  _obstacles: [],
};

const log = msg => console.log(`[${new Date().toISOString()}] ${msg}`);
const filled = (val, num) => Array(num).fill(val);
const ones = num => filled(1, num);
const zeros = num => filled(0, num);
const inv = arr => arr.map(val => (val != 0)?(1/val):0);
const repeat = (arr, num) => [].concat(...(ones(num).map(()=>arr)));
const concat = arrs => [].concat(...arrs);
const split = str => str.replace(/\s/g,'').split('').map(v => Number.parseInt(v));

const bombOffset = noteJumpSpeed*60/baseBPM;
const createNotes = verse => {
  let lenAcc = verse.offset/60*baseBPM;
  return verse.lens.map((len, idx) => {
    const note = {
      _time: lenAcc + ((verse.types[idx] == 3)?bombOffset:0),
      _type: verse.types[idx],
      _lineIndex: verse.xs[idx],
      _lineLayer: verse.ys[idx],
      _cutDirection: verse.dirs[idx],
    };
    lenAcc += len/verse.bpm*baseBPM;
    return note;
  });
}

const flowFactory = obj => {
  const out = {};
  for (prop in obj) {
    prop.split('').forEach(c => { out[c] = obj[prop]; });
  }
  return out;
}

const flowTypes = flowFactory({
  'zxcvasdfqwer': 0,
  'ZXCVASDFQWER': 1,
  '134679': 3,
});

const flowXs = flowFactory({
  'zaqZAQ147': 0,
  'xswXSW': 1,
  'cdeCDE': 2,
  'vfrVFR369': 3,
});

const flowYs = flowFactory({
  'zxcvZXCV13': 0,
  'asdfASDF46': 1,
  'qwerQWER79': 2,
});

const parseFlow = flow => {
  flow = flow.replace(/\s/g,'').split('');
  return {
    types: flow.map(c => flowTypes[c]),
    xs: flow.map(c => flowXs[c]),
    ys: flow.map(c => flowYs[c]),
  }
};

const cut2dir = '8617283405'.split('').map(c => Number.parseInt(c));

const parseCuts = cuts => {
  cuts = cuts.replace(/\s/g,'').split('');
  return { dirs: cuts.map(c => cut2dir[Number.parseInt(c)]) };
};

const addCuts = (verse, cuts) => { Object.assign(verse, parseCuts(cuts)) };
const addFlow = (verse, flow) => { Object.assign(verse, parseFlow(flow)) };

const completeVerse = verse => {
  const props = ['dirs', 'types', 'xs', 'ys'];
  const defaults = [8, 1, 1, 0];

  const vn = verse.lens.length;
  props.forEach((prop, idx) => {
    const pn = verse[prop].length;
    if (vn > pn) verse[prop].push(...filled(defaults[idx], vn - pn));
  });
}

const summaryVerse = (name, verse) => {
  const len = verse.lens.reduce((acc, len) => (acc + len));
  console.log(`Summary of ${name}`);
  console.log(`  BPM: ${verse.bpm}`);
  console.log(`  Notes: ${verse.lens.length}`);
  console.log(`  Length in beats: ${len.toFixed(0)}`);
}

const build = (path, obj) => {
  const json = JSON.stringify(obj)
  fs.writeFile(path, json, (err, data) => {
    if (err) throw err;
    log(`file out - ${path}`);
  });
}

const expertVerse1 = {
  bpm: 150,
  offset: 0.21,
  lens: concat([
    [4, 2, 2, 4, 2, 2, 4, 2, 2, 4, 4],
    repeat([4, 2, 2], 3), [4, 2, .5, 1.5],
    split('0220211 220211 22020101 022211'),
    repeat(repeat(inv([1, 3, 3, 3]), 2).concat([2, 1, 1]), 4),
    0, repeat(repeat(inv([1, 3, 3, 3]), 3).concat(filled(1/3, 6)), 3), inv([1, 3, 3, 3, 1, 3, 3, 3, 1, 3, 1.5, 3, 1.5, 3, 1.5]),
    repeat([0, 3, .5, .5], 2), repeat([1, 1, 1, 5], 2), [1, 1, 1, 1, 0, 4],
    repeat([0, 4], 4), split('111511110004'),
    repeat([0, 4], 4), split('11151111020200'),
  ]),
};
addCuts(expertVerse1, `
  00000000000
  2226224462828
  2242228 282228 26222288 221311
  8 2288 2288 338 2288 2288 288 2288 2288 284 2519 2537 46
  22 4622 8822 8822882284 3377 1199 2289422876 2828 2288 2828282822 2828 2828 11 22 33
  22 22 79 22 4613 2222 2222 46
  55 55 55 55 4382 6168 2222
  55 55 55 55 1133 3311 33 11 79
`);
addFlow(expertVerse1, `
  13131313131
  xCxFxCaSFCCxw
  xCaxCCC CExCxx xFxCxCxC xCzVzX
  W zXzX xCxC Vce VcVc CxCx XqW XzXz cVcV xwa CCzz xxVV Af
  xC aFxC wExC CxCxCxCxCa cFcF XaXa xCxFaCxCaF xzCV xCxC xzCVxzCVxC xzxz CVCV aX xC cF
  xC xC qR Cx aFXc VcXz zXcV aF
  wE wE aF aF SVEC dzxs sxDC
  wE wE aF aF zXcV VcXz DV sz qR
`);
completeVerse(expertVerse1); summaryVerse('expertVerse1', expertVerse1);

const expertVerse2 = {
  bpm: 194,
  offset: 108.25,
  lens: concat([
    1, 1, repeat(inv([2, 2, 1]), 6), 1, 1,
    repeat(inv([2, 2, 1]), 6), inv([0, 1, 2, 2, 2, 2]), 0, 2,

    repeat([0, 2], 11), 0, 1, repeat(inv([2, 1, 0, 2]), 2), 1, 1, 1, 2,
    repeat(split('01101101102'), 2),
    repeat([0, 1], 7), 0, 4, repeat([0, 1], 4),
    1, 1, .5, .5, 1, 0, 0, 2, 0, 1, 0, 2, 2, 2, 1, .5, .5, 1,
    inv(split('11222121221')), 1, 1.5, .5, 1, 0, 0, 2, 0, 0, 1, 0, 0, 0, 2,
    split('020100020002'), filled(.5, 7), 1.5, 0, 2, 0, 1,
    inv(split('11222121221')), 1, 1.5, .5, .5, 1, filled(.5, 5), 2,

    repeat([0, 2], 11), 0, 1, repeat(inv([2, 1, 2]), 2), 1, 1, 1, 2,
    repeat(split('1111112'), 2),
    repeat([0, 1], 7), 0, 0, 0, 4, repeat([0, 1], 4),
    1, 1, .5, .5, 1, 0, 0, 2, 0, 1, 0, 2, 2, 2, 1, .5, .5, 1,
    inv(split('11222121221')), 1, 1.5, .5, 1, 0, 0, 2, 0, 0, 1, 0, 0, 0, 2,
    split('020100020002'), filled(.5, 7), 1.5, 0, 2, 0, 1,
    inv(split('11222121221')), split('11110202'),

    repeat([.75, .25, .5, 1, .5, 1], 2), repeat(inv(split('22222201')), 2),
    repeat([.75, .25, .5, 1, .5, 1], 2), inv(split('22222201')), 1, 1, 0.25, 0.75, 0.25, 0.75,
    filled(0.5, 16), repeat([0, 2.2], 4), zeros(6),
  ]),
};
addCuts(expertVerse2, `
  24 284 284 284 286 284 286 42
  286 286 286 284 286 284 22 2288 22

  0000 0000 0000 0000 0000 0000 2822 2822 6491
  02 0 06 0 02 0 06 02 0 04 0 02 0 04
  2278 2289 2278 2289 33 22 11 88
  22 884 666 44 66 118426
  28 8228 46 248 2288 222 222 9977
  2222 6666 4444 2288 2288 0000
  44 2288 66 228 46 464 228864

  0000 0000 0000 0000 0000 0000 649 467 2846
  2846825 0000000
  22882288 2288228888 22 22 88 22
  22 886 444 66 44 332846
  22 2828 22 846 6464 266 881 2288
  7319 9911 1199 6422 2222 0000
  42 4286 64 282 0000 44 66

  2822 64 2822 46 22462288 22462288
  2288 64 2288 64 88228846 002222
  00000000 0000 0000 11338879 000000
`);
addFlow(expertVerse2, `
  Ca CCa CCa CCa CCs CCa CCs aC
  xxF xxF xxF xxD xxF xxD xC xCxC xC

  xCxC XcxC xCxC SdsD aFaF XcxC CEDC xwsx FaEx
  xC x xF x xC x xF Cx C Ca C Cx C Ca
  xCaD xCsF xCaD xCsF Fc Cx Xa sD
  xC xCa SDF sa df xCDaCs
  xD zxCV sF CaD xCxC qaz RFV zsVD
  zCxV DFcv asZX zCxV xVzC xCXc
  aZ zXzX Fv VcR sF aFa xCCxFa

  xCxC XcxC xCxC SdsD aFaF XcxC VCF zxa CEad
  XVSFECD qcezwxs
  zCxVzCsD xVzCxVsDwE az FV xC sD
  Cx CxF asd DF AS CxCEas
  xC xzCV xC Cas FaFa zDF aqC sxDE
  qVzR seDX zsDR FaCx VzCx xCXc
  aC aCCs FD xxx aFqR aZ vF

  zxCx Fs VCxC aF xCaFxCsD xCaFxCsD
  xCzV xD xCzV sC xCxCxCaF EwDsCx
  CxCxCxCx DsDs EwEw aXcFsDqR wsxEDC

`);
completeVerse(expertVerse2); summaryVerse('expertVerse2', expertVerse2);

const expertVerse3 = {
  bpm: 175.5,
  offset: 213.9,
  lens: concat([
    split('4 044044 044044') ,
    split('044044 04 04 004 004 000004 000004'),
    ones(8), 0, 0, 3.9, 0, 0, 3.85, 0, 0, 0,
  ]),
};
addCuts(expertVerse3, `
  6 22 4 22 6 22 4 22 6
  22 8 22 8 99 77 444 666 888888 222222
  0000 0000 222 222 444
`);
addFlow(expertVerse3, `
  F xC a xC f xC A xC F
  xC e xC W se DW asd SDF xswCDE xswCDE
  xxxx CCCC qaz RFV asd
`);
completeVerse(expertVerse3); summaryVerse('expertVerse3', expertVerse3);

const expertVerse4 = {
  bpm: 194.5,
  offset: 247.7,
  lens: concat([
    repeat(inv(split('11222121221')), 2),
    inv(split('11222121221 22122')), 1.5, inv(split('222221')),
    inv(split('11222102012201')), filled(.5, 7), 1, .5, 1.5, .5, 1,
    inv(split('11222121221')), repeat([0, 0, 2], 2), 0, 2, 0, 2, zeros(3), 29.2,
    2, 0, 2, 29.3,
    split('020002000000'),

  // filled(2, 64),
  ]),
};
addCuts(expertVerse4, `
  88 2288 22 886 88 2288 22 884
  64 2246 64 646 228 228 422886
  22 1937 2288 6488 00000000
  28 28 28 2828 28 282 666 444 33 11 0000
  6446
  22 2222 000000
`);
addFlow(expertVerse4, `
  qW zXzX zX XzD Re VcVc Vc cVs
  Fa xCzV Vz VzV Cxz xCV aCxCxF
  xC zsVD xCxC FawE xCaFwEsD
  xx CC xz CVCV VC xzz SDF dsa DV sz wsED
  FaZF
  xC xsCD xswCDE
`);
completeVerse(expertVerse4); summaryVerse('expertVerse4', expertVerse4);

const expert = Object.assign({}, defaultObj, {
  _notes: concat([
    createNotes(expertVerse1),
    createNotes(expertVerse2),
    createNotes(expertVerse3),
    createNotes(expertVerse4),
  ]),
});

build('../Expert.json', expert);
