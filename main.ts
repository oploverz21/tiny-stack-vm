// Tiny stack VM: a small exact interpreter of make.fun's tiny stack ISA.
import{readdirSync as a,readFileSync as b,writeFileSync as c,mkdirSync as d}from'node:fs';
import{join as j}from'node:path';
const I=process.env.MAKEFUN_INPUT_DIR??'/input',O=process.env.MAKEFUN_OUTPUT_DIR??'/output';
const T='1Bb57;<@00000000:::::::6:::6:::0:::0000000000000QUUQ10000000000069000000000000005525';
const B=[(x,y)=>x+y|0,(x,y)=>x-y|0,Math.imul,(x,y)=>x/y|0,(x,y)=>x%y|0,(x,y)=>(x>>>0)/(y>>>0)|0,(x,y)=>(x>>>0)%(y>>>0)|0,0,(x,y)=>x&y,(x,y)=>x|y,(x,y)=>x^y,0,(x,y)=>x<<(y&31),(x,y)=>x>>(y&31),(x,y)=>x>>>(y&31)|0,0,(x,y)=>+(x==y),(x,y)=>+(x<y),(x,y)=>+((x>>>0)<(y>>>0))];
function run(p,q){
 const D=new Int32Array(256),C=new Int32Array(64),M=new Int32Array(256);
 let s=0,w=0,pc=0,ip=0,st=0,ol=0;const o=[];
 for(;;){
  if(st==1e6)return[10,o];
  if(pc<0||pc>=p.length)return[9,o];
  const b=p[pc],t=T.charCodeAt(b)-48;
  if(!(t>0))return[5,o];
  const v=t-1,im=(v>>4)==3?4:v>>4,po=(v>>2)&3,pu=v&3;
  if(pc+im>=p.length)return[9,o];
  st++;const nx=pc+1+im,r=((p[nx-2]|p[nx-1]<<8)<<16)>>16;
  if(s<po)return[2,o];
  if(s-po+pu>256)return[3,o];
  pc=nx;
  if(b>15&&b<35&&b!=23&&b!=27){
   if(b>18&&b<23&&D[s-1]==0)return[4,o];
   const y=D[s-1],x=D[s-2];s-=2;D[s++]=B[b-16](x,y);continue;
  }
  switch(b){
   case 0:return[0,o];
   case 1:D[s++]=(p[nx-1]<<24)>>24;break;
   case 2:D[s++]=p[nx-4]|p[nx-3]<<8|p[nx-2]<<16|p[nx-1]<<24;break;
   case 3:s--;break;
   case 4:D[s]=D[s-1];s++;break;
   case 5:{const z=D[s-1];D[s-1]=D[s-2];D[s-2]=z;break;}
   case 6:D[s]=D[s-2];s++;break;
   case 7:{const z=D[s-3];D[s-3]=D[s-2];D[s-2]=D[s-1];D[s-1]=z;break;}
   case 23:D[s-1]=-D[s-1]|0;break;
   case 27:D[s-1]=~D[s-1];break;
   case 48:pc+=r;break;
   case 49:if(D[--s]==0)pc+=r;break;
   case 50:if(D[--s]!=0)pc+=r;break;
   case 51:if(w==64)return[7,o];C[w++]=pc;pc=p[nx-2]|p[nx-1]<<8;break;
   case 52:if(w==0)return[8,o];pc=C[--w];break;
   case 64:{const z=D[s-1];if(z<0||z>255)return[6,o];D[s-1]=M[z];break;}
   case 65:{const z=D[s-1],y=D[s-2];if(z<0||z>255)return[6,o];s-=2;M[z]=y;break;}
   case 80:{const z=''+D[s-1];if(ol+z.length>65536)return[11,o];s--;for(const ch of z)o.push(ch.charCodeAt(0));ol+=z.length;break;}
   case 81:if(ol+1>65536)return[11,o];o.push(D[--s]&255);ol++;break;
   case 82:D[s++]=ip<q.length?q[ip++]:-1;break;
   case 83:return[D[--s]&255,o];
  }
 }
}
for(const e of a(I).sort()){
 const r=run(b(j(I,e,'program.bin')),b(j(I,e,'input.bin')));
 d(j(O,e),{recursive:true});
 c(j(O,e,'stdout.bin'),Buffer.from(r[1]));
 c(j(O,e,'exit.txt'),r[0]+'\n');
}
