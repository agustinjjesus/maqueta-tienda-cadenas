const ARS = n => '$' + n.toLocaleString('es-AR');

const products = [
  {name:'Singapur fina',   kind:'singapur',  size:'fina',    price:36000, lengths:[45,50,60]},
  {name:'Figaro 3x1 fina', kind:'figaro',    size:'fina',    price:36000, lengths:[45,50,60]},
  {name:'Tourbillon fina', kind:'tourbillon',size:'fina',    price:36000, lengths:[45,50,60]},
  {name:'Forcet fina',     kind:'forcet',    size:'fina',    price:34000, lengths:[45,50,60]},
  {name:'Veneciana',       kind:'veneciana', size:'fina',    price:34000, lengths:[45,50]},
  {name:'Singapur mediana',kind:'singapur',  size:'mediana', price:42000, lengths:[50,60], scale:1.35},
  {name:'Tourbillon mediana',kind:'tourbillon',size:'mediana',price:44000,lengths:[50,60], scale:1.3},
  {name:'Doble grumet mediana',kind:'grumet',size:'mediana', price:44000, lengths:[50,60], scale:1.15}
];

/* Dibuja una cadena con eslabones repartidos sobre una curva. Es solo ilustrativo. */
function link(kind, i, s){
  switch(kind){
    case 'singapur':   return {adv:4.2*s, svg:`<path d="M${-2.4*s} ${-5.5*s}L${2.4*s} ${5.5*s}"/>`};
    case 'tourbillon': return {adv:5.4*s, svg:`<path d="M${-3*s} ${-6.5*s}L${3*s} ${6.5*s}"/><path d="M${-0.2*s} ${-6.5*s}L${5.8*s} ${6.5*s}" opacity=".55"/>`};
    case 'figaro':     return (i%4===3) ? {adv:17*s, svg:`<ellipse rx="${9.5*s}" ry="${3.6*s}"/>`} : {adv:6.5*s, svg:`<ellipse rx="${4.2*s}" ry="${3.4*s}"/>`};
    case 'forcet':     return {adv:6.5*s, svg:(i%2===0) ? `<ellipse rx="${6.5*s}" ry="${3.8*s}"/>` : `<ellipse rx="${2*s}" ry="${3.8*s}"/>`};
    case 'veneciana':  return {adv:7.6*s, svg:`<rect x="${-3.8*s}" y="${-3.8*s}" width="${7.6*s}" height="${7.6*s}" rx="${1.4*s}"/>`};
    default:           return {adv:6.4*s, svg:`<ellipse rx="${7.6*s}" ry="${3.9*s}" transform="rotate(26)"/>`};
  }
}

function chainSVG(kind, opt = {}){
  const s = opt.scale || 1, A=[44,40], B=[276,40], C=[160,330];
  const P = t => { const u=1-t; return [u*u*A[0]+2*u*t*C[0]+t*t*B[0], u*u*A[1]+2*u*t*C[1]+t*t*B[1]]; };
  const N = 400, pts = [], cum = [0];
  for(let i=0;i<=N;i++){
    pts.push(P(i/N));
    if(i) cum.push(cum[i-1] + Math.hypot(pts[i][0]-pts[i-1][0], pts[i][1]-pts[i-1][1]));
  }
  const total = cum[N];
  const at = L => {
    let i = 1; while(i < N && cum[i] < L) i++;
    const f = (L-cum[i-1])/((cum[i]-cum[i-1]) || 1);
    return {
      x: pts[i-1][0] + (pts[i][0]-pts[i-1][0])*f,
      y: pts[i-1][1] + (pts[i][1]-pts[i-1][1])*f,
      ang: Math.atan2(pts[i][1]-pts[i-1][1], pts[i][0]-pts[i-1][0])*180/Math.PI
    };
  };
  let L = 0, idx = 0, out = '';
  for(;;){
    const sp = link(kind, idx, s);
    L += sp.adv/2; if(L > total) break;
    const p = at(L);
    out += `<g transform="translate(${p.x.toFixed(1)} ${p.y.toFixed(1)}) rotate(${p.ang.toFixed(1)})">${sp.svg}</g>`;
    L += sp.adv/2; idx++;
  }
  const w = ({singapur:2.4,tourbillon:3.4,figaro:2.4,forcet:2.6,veneciana:2.2,grumet:3}[kind] || 2.6) * s;
  return `<svg viewBox="26 24 268 178" role="img" aria-label="Ilustración de cadena ${kind}">
    <g fill="none" stroke-linecap="round" stroke-linejoin="round">
      <g stroke="#8a6420" stroke-width="${w.toFixed(2)}">${out}</g>
      <g stroke="#f1dc9d" stroke-width="${(w*0.42).toFixed(2)}">${out}</g>
    </g></svg>`;
}

function pendantSVG(){
  return `<svg viewBox="0 0 60 90" aria-hidden="true"><g fill="none" stroke-linecap="round">
    <path d="M30 8v72M10 30h40" stroke="#8a6420" stroke-width="10"/>
    <path d="M30 8v72M10 30h40" stroke="#f1dc9d" stroke-width="4"/></g></svg>`;
}
