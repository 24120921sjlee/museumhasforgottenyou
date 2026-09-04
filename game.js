(()=>{
  'use strict';
  const c=document.getElementById('game'),x=c.getContext('2d'); x.imageSmoothingEnabled=false;
  const art={player:new Image()};art.player.src='art/player.png';
  const P={ink:'#141316',black:'#08090a',ivory:'#d4d0bd',ivory2:'#bab7a8',tile:'#c5c6bd',tile2:'#afb1aa',wall:'#ddd8c4',trim:'#7e7869',wood:'#4a342d',wood2:'#2e2421',burg:'#6d2737',burg2:'#431c28',brass:'#8b8449',brass2:'#5e5a32',navy:'#172d43',navy2:'#0c1722',green:'#172d25',green2:'#0d1c17',paper:'#e3ddc7',white:'#f3eee1',pink:'#b87092',red:'#8b2735',shadow:'#343638',skin:'#c89d7a',hair:'#352b28'};
  const scenes=[
    {n:'Closing Time',r:0,t:'The hallway lights are off. Your phone still says 6:47 PM.',a:['Go to the main entrance.','Wait for someone to return.'],ok:0,go:'No footsteps come. By morning, a brass plaque bears your silhouette.'},
    {n:'The Locked Entrance',r:1,t:'The front doors will not move. Slow footsteps cross the upper gallery.',a:['Call out to the footsteps.','Hide behind the information desk.'],ok:1,go:'The footsteps stop behind you. A gloved hand closes over your eyes.'},
    {n:'The Blank Visitor Card',r:2,t:'Behind the desk, your museum visitor card is blank where your name should be.',a:['Put the card away.','Keep staring at the blank space.'],ok:0,go:'Letters rise from the paper and settle beneath the glass: UNKNOWN VISITOR.'},
    {n:'A Familiar Date',r:3,t:'A new plaque lists your birthday beneath a sealed display case.',a:['Touch the warm engraved date.','Cover the plaque with a brochure.'],ok:1,go:'The date deepens under your finger. Your next birthday disappears from memory.'},
    {n:'The Sealed Exhibit',r:4,t:'A velvet visitor chair sits beneath museum glass. Your initials are scratched into its arm.',a:['Read the label from a distance.','Sit in the chair.'],ok:0,go:'The glass drops around you. The label changes to VISITOR, SEATED.'},
    {n:'Portrait of Home',r:5,t:'A painting shows your front door. Something inside is turning the handle.',a:['Step closer and knock.','Say the color of the real door.'],ok:1,go:'The painted door opens inward. The room behind it has no floor.'},
    {n:'The Girl in Umber',r:6,t:'A painted girl moves her lips: “When he asks your name, do not answer.”',a:['Nod and remember her warning.','Ask the painting for her name.'],ok:0,go:'She answers. Her name enters your mouth and pushes yours out.'},
    {n:'The Curator',r:7,t:'A velvet voice fills the gallery: “Lost guest, tell me your name.”',a:['Give only your first name.','Stay completely silent.'],ok:1,go:'“Thank you,” says the Curator. Somewhere, a catalogue drawer clicks shut.'},
    {n:'The Memory Map',r:8,t:'The museum map now shows rooms from your life. One date is not yours.',a:['Follow the room marked 03/14.','Follow the room marked MY BEDROOM.'],ok:0,go:'Your bedroom door opens. It has been waiting to learn the rest of you.'},
    {n:'The Roped Passage',r:9,t:'Burgundy ropes sway without wind. Pale floor tiles form a narrow path.',a:['Climb over the nearest rope.','Walk only on the pale tiles.'],ok:1,go:'The rope coils gently around your waist. The brass posts begin to walk.'},
    {n:'Seven Reflections',r:10,t:'Your reflection moves one breath too late. Its badge reads EXHIBIT 27.',a:['Close your eyes and count to seven.','Touch its raised hand.'],ok:0,go:'The glass is soft. Your reflection steps out while you remain behind it.'},
    {n:'Lost Property',r:11,t:'Drawers hold your shoes, your photos, your voice. One brass key is unlabeled.',a:['Take back your coat-check token.','Take the unlabeled brass key.'],ok:1,go:'The token pins itself through your coat. The drawer slides closed with you inside.'},
    {n:'The Catalogue',r:12,t:'Entry 27 is almost complete. A blank page waits beside your record.',a:['Place the blank page over Entry 27.','Tear your record from the book.'],ok:0,go:'The torn paper bleeds black ink. Every exit in the catalogue is crossed out.'},
    {n:'The Empty Attendant',r:13,t:'A headless mannequin wears a museum coat and the name you can no longer read.',a:['Whisper, “That is me.”','Remove the name tag.'],ok:1,go:'The mannequin turns. The museum accepts your identification.'},
    {n:'Conservation Room',r:14,t:'The brass key fits a cabinet beside a portrait being carefully erased.',a:['Unlock the cabinet.','Pour solvent over the portrait.'],ok:0,go:'The face beneath the paint is yours. The solvent reaches the original.'},
    {n:'The Stopped Clock',r:15,t:'Inside the cabinet, a clock is fixed at 6:47. Its minute hand can move once.',a:['Wind it forward to 6:48.','Wind it backward to 6:46.'],ok:1,go:'The museum closes again. This time, it closes around you.'},
    {n:'The Empty Frame',r:16,t:'The painted girl is gone. Three knocks sound from behind her empty canvas.',a:['Whisper, “I remember you.”','Pull the canvas away from the wall.'],ok:0,go:'There is no wall behind the frame—only a gallery filled with your portraits.'},
    {n:'Emergency Exit',r:17,t:'A fire door opens. The Curator follows, dragging your sketchbook by one page.',a:['Turn back for the sketchbook.','Leave the sketchbook and shut the door.'],ok:1,go:'Every drawing turns to look at you. The door closes while you apologize.'},
    {n:'The Final Portrait',r:18,t:'The central canvas now shows you beneath a gold frame. A black cloth lies nearby.',a:['Cover the portrait’s face.','Break the frame with the brass post.'],ok:0,go:'The broken frame multiplies. Each piece holds a smaller, frightened you.'},
    {n:'Exhibit 27',r:19,t:'The entrance opens, but the registry asks for Exhibit 27’s true name.',a:['Sign the name from your visitor card.','Write “NO ONE” and cross out 27.'],ok:1,go:'The ink recognizes you. The doors open only wide enough for the light to leave.'}
  ];
  let mode='title',scene=0,sel=0,reveal=0,last=0,death='',flash=0;
  const spots=[[151,113],[78,110],[197,112],[232,110],[72,110],[222,111],[78,109],[96,110],[246,110],[145,112],[74,111],[238,110],[151,112],[88,110],[144,111],[228,110],[70,111],[197,110],[240,110],[151,113]];
  const stars=[];for(let i=0;i<38;i++)stars.push([(i*47)%320,(i*29)%154,(i%3)+1]);
  function rect(a,b,d,e,f){x.fillStyle=f;x.fillRect(a,b,d,e)}
  function line(a,b,d,e,f,w=1){x.strokeStyle=f;x.lineWidth=w;x.beginPath();x.moveTo(a+.5,b+.5);x.lineTo(d+.5,e+.5);x.stroke()}
  function txt(s,a,b,f=P.white,size=8,align='left'){x.fillStyle=f;x.font=`${size}px monospace`;x.textAlign=align;x.textBaseline='top';x.fillText(s,a,b)}
  function wrap(s,max){const ws=s.split(' '),out=[];let q='';for(const w of ws){const n=q?q+' '+w:w;if(n.length>max){if(q)out.push(q);q=w}else q=n}if(q)out.push(q);return out}
  function wall(){
    rect(0,0,320,154,P.navy2);rect(0,0,320,9,P.ink);rect(0,9,320,29,P.navy);rect(0,36,320,2,P.black);rect(0,38,320,6,P.brass2);rect(0,42,320,2,P.wood2);
    for(let xx=2;xx<320;xx+=11){const h=7+(xx*3)%19;rect(xx,11,2,h,xx%3?P.navy2:P.shadow);rect(xx+4,14+(xx%9),1,8,P.wood2)}
    for(let xx=5;xx<320;xx+=29){rect(xx,27+(xx%5),3,1,P.trim);rect(xx+8,16+(xx%7),1,2,P.brass2)}
    for(let yy=44;yy<154;yy+=16)for(let xx=0;xx<320;xx+=16){const alt=((xx+yy)/16)%2;rect(xx,yy,16,16,alt?P.tile:P.tile2);line(xx,yy,xx+16,yy,P.ivory2);line(xx,yy,xx,yy+16,P.trim);line(xx+1,yy+15,xx+15,yy+1,alt?P.ivory2:P.tile);if((xx+yy)%48===0)rect(xx+5,yy+10,2,1,P.trim)}
    rect(0,148,320,2,P.trim);rect(0,150,320,4,P.wood2);
    rect(12,44,32,6,P.wood2);rect(16,18,24,22,P.wood);rect(19,21,18,15,P.navy);rect(280,44,28,6,P.wood2);rect(284,17,20,23,P.wood);rect(287,20,14,17,P.navy2);
  }
  function door(px,py=8,w=34){rect(px-2,py-2,w+4,38,P.ink);rect(px,py,w,36,P.wood2);rect(px+3,py+4,w-6,32,P.black);rect(px+6,py+7,w-12,29,P.navy2);line(px+8,py+9,px+8,py+34,P.navy);line(px+w-9,py+9,px+w-9,py+34,P.black);rect(px+w-9,py+21,3,3,P.brass2);rect(px+w-8,py+21,1,1,P.brass)}
  function rope(y=93,x0=58,x1=262){for(let p=x0;p<=x1;p+=34){rect(p-2,y,5,22,P.brass2);rect(p-1,y+2,2,17,P.brass);rect(p-3,y-2,7,5,P.brass);rect(p-2,y-1,4,1,P.ivory2);rect(p-4,y+19,9,3,P.ink);rect(p-2,y+19,5,1,P.brass2)}for(let p=x0;p<x1;p+=34){line(p+3,y+4,p+31,y+9,P.burg2,4);line(p+3,y+3,p+31,y+8,P.burg,2);for(let q=7;q<29;q+=7)rect(p+q,y+4+((q/7)|0),2,1,P.pink)}}
  function frame(px,py,w,h,inside=P.navy){rect(px-1,py-1,w+2,h+2,P.ink);rect(px,py,w,h,P.wood2);rect(px+2,py+2,w-4,h-4,P.brass2);rect(px+3,py+3,w-6,h-6,P.brass);rect(px+5,py+5,w-10,h-10,inside);line(px+6,py+6,px+w-7,py+6,P.ivory2);rect(px+w/2-9,py+h+2,18,4,P.shadow);rect(px+w/2-7,py+h+3,14,2,P.brass2)}
  function desk(px,py){rect(px-2,py-2,54,3,P.ink);rect(px,py,50,7,P.wood);line(px+2,py+2,px+47,py+2,P.trim);rect(px+3,py+7,5,14,P.wood2);rect(px+5,py+8,2,11,P.wood);rect(px+42,py+7,5,14,P.wood2);rect(px+43,py+8,2,11,P.wood);rect(px+18,py-4,17,5,P.paper);line(px+20,py-2,px+32,py-2,P.trim)}
  function plaque(px,py,w=28){rect(px-1,py-1,w+2,9,P.ink);rect(px,py,w,7,P.shadow);rect(px+2,py+2,w-4,3,P.brass);rect(px+4,py+2,w-8,1,P.ivory2)}
  function girl(px,py,back=false){
    rect(px+5,py,9,2,P.hair);rect(px+3,py+2,13,4,P.hair);rect(px+2,py+5,15,7,P.hair);rect(px+4,py+5,10,8,back?P.hair:P.skin);rect(px+3,py+6,3,7,P.hair);rect(px+13,py+5,3,7,P.hair);if(!back){rect(px+6,py+8,2,1,P.ink);rect(px+11,py+8,2,1,P.ink);rect(px+7,py+10,4,1,'#9c7157')}
    rect(px+4,py+13,11,3,P.burg);rect(px+3,py+16,13,7,P.burg2);rect(px+6,py+16,7,5,P.wood2);rect(px+8,py+15,3,2,P.pink);rect(px+9,py+17,1,4,P.ivory);rect(px+2,py+15,2,8,P.skin);rect(px+16,py+15,2,8,P.skin);rect(px+3,py+22,13,5,P.ink);rect(px+5,py+22,9,1,P.ivory2);rect(px+4,py+27,4,4,P.skin);rect(px+11,py+27,4,4,P.skin);rect(px+4,py+30,4,4,P.wood2);rect(px+11,py+30,4,4,P.wood2);rect(px+3,py+33,5,2,P.black);rect(px+11,py+33,5,2,P.black);
  }
  function hero(px,py){if(art.player.naturalWidth)x.drawImage(art.player,px,py,18,36);else girl(px,py)}
  function shadowGirl(px,py){rect(px+5,py,7,5,P.black);rect(px+3,py+5,11,9,P.black);rect(px+4,py+14,9,10,P.black);rect(px+4,py+24,3,6,P.black);rect(px+10,py+24,3,6,P.black)}
  function drawRoom(id){
    wall();
    if(id===0){door(143);frame(64,17,34,26);frame(222,17,34,26);rope(94,80,240);frame(129,55,62,35,P.navy);plaque(145,93)}
    if(id===1){door(143);desk(55,108);shadowGirl(248,59);frame(80,18,32,24);frame(208,18,32,24)}
    if(id===2){desk(118,95);rect(137,78,28,18,P.paper);rect(140,81,8,8,P.shadow);line(151,83,161,83,P.tile2);line(151,87,159,87,P.tile2);door(270)}
    if(id===3){rect(105,54,110,54,P.shadow);rect(109,58,102,46,P.ivory2);plaque(136,112,48);rope(120,92,228);txt('06 · 11',160,77,P.burg,12,'center')}
    if(id===4){rect(102,50,116,70,P.shadow);rect(106,54,108,62,P.tile2);rect(143,66,34,7,P.wood2);rect(146,70,28,25,P.burg2);rect(149,73,22,18,P.burg);rect(143,94,34,6,P.wood);rect(146,100,5,15,P.wood2);rect(169,100,5,15,P.wood2);plaque(143,121,34);frame(40,18,28,24);frame(252,18,28,24)}
    if(id===5){frame(113,48,94,66,P.navy2);rect(139,60,42,47,P.wood2);rect(145,67,30,40,P.burg2);rect(168,86,2,2,P.brass);plaque(142,118,36)}
    if(id===6){frame(125,42,70,82,P.wood2);rect(131,48,58,70,'#725b47');hero(151,64);plaque(140,127,40)}
    if(id===7){door(143);rope(106,76,244);rect(152,45,16,44,P.black);rect(148,48,24,7,P.shadow);rect(145,87,30,5,P.black)}
    if(id===8){rect(72,48,176,74,P.ivory2);rect(78,54,164,62,P.paper);for(let i=0;i<4;i++)line(90,66+i*12,229,66+i*12,P.trim);for(let i=0;i<5;i++)line(94+i*30,58,94+i*30,110,P.trim);txt('03/14',105,72,P.burg2,8);txt('HOME',174,96,P.burg2,8)}
    if(id===9){rope(61,42,278);rope(112,42,278);for(let i=0;i<7;i++)rect(65+i*28,74,16,28,P.ivory)}
    if(id===10){for(let i=0;i<5;i++){frame(25+i*60,49,42,68,P.navy2);shadowGirl(38+i*60,71)}txt('27',286,57,P.pink,8)}
    if(id===11){for(let yy=50;yy<120;yy+=24)for(let xx=54;xx<270;xx+=44){rect(xx,yy,36,18,P.wood);rect(xx+16,yy+7,4,3,P.brass)}rect(157,82,6,12,P.brass)}
    if(id===12){desk(80,106);rect(97,53,126,59,P.wood2);rect(102,58,116,49,P.paper);line(160,58,160,107,P.trim);txt('27',181,69,P.burg,12);for(let i=0;i<4;i++)line(170,86+i*4,205,86+i*4,P.shadow)}
    if(id===13){rect(150,53,20,8,P.black);rect(145,62,30,42,P.wood2);rect(149,64,22,36,P.burg2);rect(157,65,6,29,P.brass2);rect(140,65,5,30,P.skin);rect(175,65,5,30,P.skin);rect(148,104,8,18,P.wood2);rect(164,104,8,18,P.wood2);plaque(141,126,38)}
    if(id===14){rect(42,51,64,72,P.ivory2);rect(47,56,54,62,P.brass2);for(let yy=60;yy<115;yy+=18)line(50,yy,98,yy,P.wood2);frame(185,49,66,66,'#8c7a68');rect(207,61,21,35,P.paper);rect(213,70,9,18,P.skin)}
    if(id===15){frame(116,44,88,76,P.wood2);x.fillStyle=P.paper;x.beginPath();x.arc(160,82,28,0,Math.PI*2);x.fill();x.fillStyle=P.ink;x.beginPath();x.arc(160,82,3,0,Math.PI*2);x.fill();line(160,82,160,59,P.ink,2);line(160,82,181,82,P.red,2);txt('6:47',160,113,P.burg,8,'center')}
    if(id===16){frame(118,43,84,81,P.black);rect(124,49,72,69,P.wood2);rect(127,52,66,63,P.black);for(let i=0;i<3;i++)rect(151+i*8,70+(i%2)*5,4,4,P.ivory)}
    if(id===17){door(236,46,42);rect(244,58,25,57,P.green2);rect(249,61,15,6,P.ivory);txt('EXIT',256,62,P.green2,5,'center');shadowGirl(71,79);rect(83,101,24,17,P.paper);line(84,104,105,114,P.ink)}
    if(id===18){frame(105,42,110,88,P.brass2);rect(111,48,98,76,P.navy);hero(151,68);rect(67,102,35,22,P.black);rope(125,44,276)}
    if(id===19){door(128,4,64);rect(141,12,38,28,P.green2);rect(0,43,320,5,P.brass2);desk(53,105);rect(70,87,26,17,P.paper);plaque(223,91,48);txt('EXHIBIT 27',247,93,P.burg,6,'center')}
    const [hx,hy]=spots[id];rect(hx-2,hy+34,22,3,P.shadow);rect(hx+2,hy+33,14,3,P.ink);hero(hx,hy);
    rect(0,150,320,6,P.ink);
  }
  function dialog(){
    rect(5,158,310,77,P.wood2);rect(7,160,306,73,P.brass2);rect(9,162,302,69,P.green);rect(12,165,296,63,P.green2);
    for(let i=0;i<3;i++){rect(14+i*4,167,2,2,P.brass);rect(302-i*4,224,2,2,P.brass)}
    txt(`${String(scene+1).padStart(2,'0')}  ${scenes[scene].n.toUpperCase()}`,18,168,P.pink,7);
    const shown=scenes[scene].t.slice(0,reveal),ls=wrap(shown,54);ls.slice(0,2).forEach((s,i)=>txt(s,18,180+i*10,P.white,8));
    if(reveal>=scenes[scene].t.length){scenes[scene].a.forEach((s,i)=>{txt(i===sel?'▶':' ',18,204+i*11,i===sel?P.paper:P.ivory2,8);txt(s,29,204+i*11,i===sel?P.white:P.ivory2,8)})}
  }
  function title(){
    rect(0,0,320,240,P.black);for(const s of stars)rect(s[0],s[1],s[2],s[2],s[0]%2?P.shadow:P.ivory2);
    rect(25,20,270,132,P.wall);rect(25,20,270,8,P.trim);for(let yy=28;yy<152;yy+=16)for(let xx=25;xx<295;xx+=16)rect(xx,yy,16,16,((xx+yy)/16)%2?P.ivory:P.tile);
    door(143,24);frame(105,58,110,70,P.brass2);rect(111,64,98,58,P.navy2);shadowGirl(151,80);rope(129,73,247);
    rect(0,152,320,88,P.green2);rect(0,152,320,4,P.wood);txt('THE MUSEUM HAS',160,166,P.white,14,'center');txt('FORGOTTEN YOU',160,184,P.pink,14,'center');
    if((Date.now()/550|0)%2===0)txt('PRESS ENTER / TAP TO BEGIN',160,216,P.ivory2,8,'center');
  }
  function gameOver(){
    drawRoom(scenes[scene].r);rect(0,0,320,240,'rgba(12,5,8,.78)');
    txt('GAME OVER',160,45,P.red,18,'center');txt(`EXHIBIT ${String(scene+1).padStart(2,'0')} ACQUIRED`,160,72,P.pink,8,'center');
    wrap(death,52).slice(0,4).forEach((s,i)=>txt(s,160,99+i*11,P.ivory,8,'center'));
    if((Date.now()/550|0)%2===0)txt('ENTER / TAP — TRY THIS SCENE AGAIN',160,197,P.white,8,'center');
  }
  function ending(){
    rect(0,0,320,240,P.black);for(let i=0;i<10;i++){rect(20+i*31,22+(i%3)*9,2,2,P.ivory2)}
    rect(40,36,240,100,P.wall);rect(40,36,240,6,P.brass2);door(143,42);rect(143,48,34,65,P.paper);girl(152,104,true);rect(40,132,240,4,P.trim);
    txt('GOOD END',160,151,P.pink,12,'center');txt('THE UNCATALOGUED',160,169,P.white,14,'center');
    txt('The museum forgets what it cannot name.',160,194,P.ivory2,8,'center');txt('At 6:46, you step outside.',160,205,P.ivory2,8,'center');
    if((Date.now()/600|0)%2===0)txt('ENTER / TAP — RETURN TO TITLE',160,226,P.brass,7,'center');
  }
  function draw(){x.imageSmoothingEnabled=false;if(mode==='title')title();else if(mode==='play'){drawRoom(scenes[scene].r);dialog()}else if(mode==='dead')gameOver();else ending();if(flash>0){rect(0,0,320,240,flash%4<2?P.white:P.black);flash--}requestAnimationFrame(draw)}
  function startScene(i){scene=i;sel=0;reveal=0;last=performance.now();mode='play'}
  function confirm(){
    if(mode==='title'){startScene(0);return}if(mode==='dead'){startScene(scene);return}if(mode==='end'){mode='title';return}
    const s=scenes[scene];if(reveal<s.t.length){reveal=s.t.length;return}
    if(sel===s.ok){if(scene===scenes.length-1)mode='end';else startScene(scene+1)}else{death=s.go;mode='dead';flash=5}
  }
  addEventListener('keydown',e=>{if(['ArrowUp','ArrowDown','Enter',' ','z','Z'].includes(e.key))e.preventDefault();if(mode==='play'&&reveal>=scenes[scene].t.length&&(e.key==='ArrowUp'||e.key==='ArrowDown'))sel=1-sel;else if(['Enter',' ','z','Z'].includes(e.key))confirm()});
  c.addEventListener('pointerdown',e=>{c.focus();const b=c.getBoundingClientRect(),py=(e.clientY-b.top)*240/b.height;if(mode==='play'&&reveal>=scenes[scene].t.length&&py>=201){sel=py<215?0:1;confirm()}else confirm()});
  if(document.modelContext?.registerTool){
    const safeRegister=tool=>{try{Promise.resolve(document.modelContext.registerTool(tool)).catch(()=>{})}catch{}};
    safeRegister({name:'read_game_state',title:'Read game state',description:'Read the current scene and available choices in the visible game.',inputSchema:{type:'object',properties:{},additionalProperties:false},annotations:{readOnlyHint:true,untrustedContentHint:false},execute:()=>({mode,scene:mode==='play'?scene+1:null,title:mode==='play'?scenes[scene].n:null,choices:mode==='play'?scenes[scene].a:[]})});
    safeRegister({name:'choose_game_option',title:'Choose an option',description:'Select option 1 or 2 in the current visible scene and advance the game.',inputSchema:{type:'object',properties:{option:{type:'integer',enum:[1,2]}},required:['option'],additionalProperties:false},annotations:{readOnlyHint:false,untrustedContentHint:false},execute:input=>{if(mode!=='play')throw new Error('Start the game in the visible interface first.');if(!input||!Number.isInteger(input.option)||input.option<1||input.option>2)throw new Error('option must be 1 or 2');reveal=scenes[scene].t.length;sel=input.option-1;confirm();return{mode,scene:mode==='play'?scene+1:null,result:mode==='dead'?'game_over':mode==='end'?'good_end':'advanced'}}});
  }
  function tick(now){if(mode==='play'&&reveal<scenes[scene].t.length&&now-last>24){reveal++;last=now}requestAnimationFrame(tick)}
  c.focus();requestAnimationFrame(draw);requestAnimationFrame(tick);
})();
