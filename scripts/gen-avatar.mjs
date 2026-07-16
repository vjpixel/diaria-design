#!/usr/bin/env node
// Gera o avatar/favicon "d.." (Georgia outlined) em assets/avatar/.
// Composição + proporção: ver guidelines/avatar-proportion.md.
// Self-contained: o "d" é um <path> outlined embutido — NÃO precisa de fonte.
//
//   node scripts/gen-avatar.mjs        # regenera SVG + PNGs
//   node scripts/gen-avatar.mjs --check # valida invariantes estruturais (pngjs)

import { writeFileSync, mkdirSync, existsSync, readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join, relative } from 'node:path';

const __dirname = dirname(fileURLToPath(import.meta.url));
const OUT = join(__dirname, '..', 'assets', 'avatar');

// --- composição canônica (viewBox 1080; círculo cx=540 cy=540) ---------------
const DPATH = "M1351 21 858 -8 843 6V98L836 100Q787 47 703.5 7.5Q620 -32 535 -32Q333 -32 202.0 118.0Q71 268 71 506Q71 717 217.5 868.0Q364 1019 572 1019Q654 1019 726.0 1000.5Q798 982 841 957V1284Q841 1321 826.0 1353.5Q811 1386 786 1404Q755 1426 708.5 1435.5Q662 1445 615 1449V1522L1155 1548L1170 1532V221Q1170 183 1182.5 157.0Q1195 131 1223 116Q1244 105 1284.5 100.0Q1325 95 1351 94ZM841 199V764Q834 787 821.5 815.0Q809 843 787 868Q767 889 733.5 905.0Q700 921 658 921Q558 921 494.0 808.0Q430 695 430 489Q430 408 441.5 343.5Q453 279 482 226Q511 173 556.5 143.0Q602 113 666 113Q727 113 767.0 136.5Q807 160 841 199Z";            // glifo 'd' Georgia Bold, outlined
const S2 = (470/2048).toFixed(6);    // font-size 470, upm 2048
const DOT_R=45, DOT_CY=662, DOT1=699, DOT2=824;

// PROPORÇÃO CANÔNICA (editor 260716): d.. a 1.2× do círculo. Mudar SÓ aqui.
export const PROPORTION = 1.2;

const BASE_FIT = {
  'bola-preta':1.0, 'bola-branca':1.0, 'bola-teal':1.0,
  'avatar':0.8, 'fundo-branco':0.926, 'anel':0.815,
};
const TEAL='#00A0A0', INK='#171411', WHITE='#FFFFFF';
const dd = (d,dot)=>`<path transform="translate(310 700) scale(${S2} -${S2})" d="${DPATH}" fill="${d}"/><circle cx="${DOT1}" cy="${DOT_CY}" r="${DOT_R}" fill="${dot}"/><circle cx="${DOT2}" cy="${DOT_CY}" r="${DOT_R}" fill="${dot}"/>`;
const grp = (d,dot,t)=>`<g transform="translate(540 540) scale(${(BASE_FIT[t]*PROPORTION).toFixed(4)}) translate(-540 -540)">${dd(d,dot)}</g>`;

const TREATMENTS = {
  'bola-preta':  `<circle cx="540" cy="540" r="540" fill="${INK}"/>${grp(WHITE,TEAL,'bola-preta')}`,
  'bola-branca': `<circle cx="540" cy="540" r="540" fill="${WHITE}"/>${grp(INK,TEAL,'bola-branca')}`,
  'bola-teal':   `<circle cx="540" cy="540" r="540" fill="${TEAL}"/>${grp(WHITE,WHITE,'bola-teal')}`,
  'avatar':       `<rect width="1080" height="1080" fill="${INK}"/><circle cx="540" cy="540" r="432" fill="${WHITE}"/>${grp(INK,TEAL,'avatar')}`,
  'fundo-branco': `<rect width="1080" height="1080" fill="${WHITE}"/><circle cx="540" cy="540" r="500" fill="${INK}"/>${grp(WHITE,TEAL,'fundo-branco')}`,
  'anel':         `<circle cx="540" cy="540" r="500" fill="none" stroke="${INK}" stroke-width="26"/>${grp(INK,TEAL,'anel')}`,
};
const NAME = {
  'bola-preta':'diaria-avatar-dd-bola-preta','bola-branca':'diaria-avatar-dd-bola-branca',
  'bola-teal':'diaria-avatar-dd-bola-teal','avatar':'diaria-avatar-dd',
  'fundo-branco':'diaria-avatar-dd-bola-preta-fundo-branco','anel':'diaria-avatar-dd-anel',
};
const SIZES=[16,32,64,180,320,512,1024,1080];
const svgOf = (n)=>`<?xml version="1.0"?>\n<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1080 1080">${TREATMENTS[n]}</svg>\n`;

async function runExport(){
  const { Resvg } = await import('@resvg/resvg-js');
  mkdirSync(OUT,{recursive:true});
  let n=0;
  for (const key of Object.keys(TREATMENTS)){
    const base=NAME[key];
    writeFileSync(join(OUT,`${base}.svg`), svgOf(key)); n++;
    for (const s of SIZES){
      const svg=svgOf(key).replace(/<svg /,`<svg width="${s}" height="${s}" `);
      writeFileSync(join(OUT,`${base}-${s}.png`), new Resvg(svg,{font:{loadSystemFonts:false,fontBuffers:[]}}).render().asPng()); n++;
    }
  }
  console.log(`gerados ${n} arquivos (PROPORTION=${PROPORTION})`);
}

async function runCheck(){
  const { PNG } = await import('pngjs');
  const errs=[];
  for (const key of Object.keys(TREATMENTS)){
    const base=NAME[key];
    for (const s of SIZES){
      const p=join(OUT,`${base}-${s}.png`);
      if(!existsSync(p)){ errs.push(`faltando ${base}-${s}.png — rode gen-avatar`); continue; }
      const png=PNG.sync.read(readFileSync(p));
      if(png.width!==s||png.height!==s) errs.push(`${base}-${s}: ${png.width}x${png.height} != ${s}x${s}`);
      let opaque=0; for(let i=3;i<png.data.length;i+=4) if(png.data[i]>200) opaque++;
      if(opaque===0) errs.push(`${base}-${s}: sem pixels opacos`);
    }
  }
  if(errs.length){ console.error(errs.join('\n')); process.exit(1); }
  console.log('ok — avatares batem com as invariantes');
}
if (process.argv.includes('--check')) await runCheck(); else await runExport();
