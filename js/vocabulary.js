/* Extend the bank without changing legacy lesson/question IDs or answer choices. */
(function () {
  'use strict';
  const D=window.MoversData, L=window.MoversLexicon;
  const legacy=D.vocabulary.slice();
  const bank=L.entries.map(v=>({...v}));
  const canon = word => bank.find(v=>v.word.toLowerCase()===word.toLowerCase() || v.aliases.some(a=>a.toLowerCase()===word.toLowerCase()));
  const extensionTopics={1:'school',2:'animals',3:'health',4:'transport',5:'sport',6:'time',7:'description',8:'language'};
  const legacyMap={};
  for (const v of legacy) {
    let c=canon(v.word);
    if (v.word==='bat') c=bank.find(x=>x.id==='lex-movers-bat');
    if (!c) {
      c={...v,id:'lex-extension-'+v.word.toLowerCase().replace(/[^a-z0-9]+/g,'-'),level:'extension',topic:extensionTopics[v.week],aliases:[]};
      bank.push(c);
    }
    if (!c.example) c.example=v.example;
    if (!c.emoji) c.emoji=v.emoji;
    legacyMap[v.word]=c.id;
    v.wordId=c.id;
    // Annotate all five old question types with stable vocabulary identities.
    const index=D.weeks[v.week-1].vocabulary.indexOf(v);
    for (let mode=0;mode<5;mode++) {
      const q=D.allQuestions[`w${v.week}-vocabulary${index*5+mode}`];
      q.wordId=c.id; q.evidence=mode<2?'recognition':mode<4?'spelling':'context';
    }
  }
  const wordById=Object.fromEntries(bank.map(v=>[v.id,v]));
  for (const [i,v] of bank.entries()) {
    const others=bank.filter(x=>x.topic===v.topic && x.id!==v.id && x.word!==v.word && x.meaning!==v.meaning);
    const distractors=(others.length>=2?others:bank.filter(x=>x.word!==v.word && x.meaning!==v.meaning)).slice(i%Math.max(1,others.length-2));
    const candidates=[...distractors,...bank.filter(x=>x.word!==v.word && x.meaning!==v.meaning)];
    const chosen=[];
    for (const x of candidates) {if(!chosen.some(c=>c.word===x.word || c.meaning===x.meaning)) chosen.push(x);if(chosen.length===2)break;}
    const rotate=list=>list.slice(i%3).concat(list.slice(0,i%3));
    const base={week:v.week,skill:'vocabulary',wordId:v.id,explanation:v.example || `${v.word}: ${v.meaning}`,topic:L.topics[v.topic]};
    const questions=[
      {mode:'meaning',type:'choice',prompt:`“${v.word}” có nghĩa là gì?`,answer:v.meaning,options:rotate([v.meaning,...chosen.map(x=>x.meaning)]),evidence:'recognition'},
      {mode:'listen',type:'choice',prompt:'Nghe rồi chọn từ con vừa nghe.',audio:v.word,answer:v.word,options:rotate([v.word,...chosen.map(x=>x.word)]),evidence:'recognition'},
      {mode:'spelling',type:'input',prompt:`Viết từ tiếng Anh: ${v.meaning}`,answer:v.word,accept:v.aliases,evidence:'spelling'},
      {mode:'letters',type:'input',prompt:`Xếp chữ thành từ: ${v.meaning}`,answer:v.word,letterTiles:true,evidence:'recognition'}
    ];
    questions.forEach(q=>{q.id=`${v.id}-${q.mode}`;D.allQuestions[q.id]={...base,...q};});
  }
  D.wordBank=bank;D.wordById=wordById;D.wordByLegacy=legacyMap;D.wordTopics=L.topics;
  D.vocabulary=[...legacy,...bank]; // Restore both old and new in-progress flashcards.
  D.bankQuestions=(cards,mode)=>cards.map(v=>D.allQuestions[`${v.id}-${mode}`]);
  // Spread the core across 6 teaching weeks; the final 2 weeks revisit every topic.
  const priority=bank.filter(v=>v.level==='movers' && !['numbers','names'].includes(v.topic));
  const core=[...priority,...bank.filter(v=>v.level==='movers' && ['numbers','names'].includes(v.topic))];
  D.dailyWords=(week,day,track,progress)=>{
    const pool=track==='foundation'?bank.filter(v=>v.level==='starters'):core;
    const index=(week-1)*5+day-1;
    const chunk=10;
    const assigned=week<=6?pool.slice(index*chunk,(index+1)*chunk):[];
    const now=new Date();
    const today=`${now.getFullYear()}-${String(now.getMonth()+1).padStart(2,'0')}-${String(now.getDate()).padStart(2,'0')}`;
    const due=pool.filter(v=>progress[v.id]?.needsReview || progress[v.id]?.due && progress[v.id].due<=today).sort((a,b)=>(progress[a.id].due||'').localeCompare(progress[b.id].due||''));
    const untested=pool.filter(v=>!progress[v.id]?.spelling);
    return [...new Map([...due,...assigned,...(week>6?untested:[]) ,...pool].map(v=>[v.id,v])).values()].slice(0,chunk);
  };
})();
