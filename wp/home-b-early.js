
/* ao abrir ou recarregar, a página sempre começa do topo (o navegador costuma voltar à posição anterior) */
if('scrollRestoration' in history) history.scrollRestoration='manual';
window.scrollTo(0,0);
addEventListener('pageshow',function(e){if(e.persisted) window.scrollTo(0,0)});
;

/* origem da visita: primeira origem (como conheceu a BMC) e última origem com sinal (o que trouxe agora).
   Fica no navegador do visitante e vai junto no lead (HubSpot) e no dataLayer (GTM). */
(function(){
  var KEYS=['utm_source','utm_medium','utm_campaign','utm_content','utm_term','utm_region','utm_placement','gclid','gbraid','wbraid','fbclid','ttclid','msclkid','li_fat_id'];
  var DAY=864e5, TTL=90*DAY;
  function ck(n){var m=document.cookie.match('(?:^|; )'+n+'=([^;]*)');return m?decodeURIComponent(m[1]):''}
  function get(k){try{return JSON.parse(localStorage.getItem(k)||'null')}catch(e){return null}}
  function put(k,v){try{localStorage.setItem(k,JSON.stringify(v))}catch(e){}}
  var q=new URLSearchParams(location.search), t={ts:new Date().toISOString(),landing:location.origin+location.pathname,referrer:document.referrer||''};
  var signal=false; KEYS.forEach(function(k){var v=q.get(k); if(v){t[k]=v; signal=true}});
  var ref=t.referrer, host=''; try{host=ref?new URL(ref).hostname:''}catch(e){}
  var external=host&&host!==location.hostname&&!/bmchyundai\.com\.br$/.test(host);
  if(external) signal=true;
  // canal legível para o comercial
  var ch='Direto';
  if(t.gclid||t.gbraid||t.wbraid) ch='Google Ads';
  else if(t.fbclid||/^(fb|facebook|ig|instagram|meta)/i.test(t.utm_source||'')) ch=/paid|cpc|ads/i.test(t.utm_medium||'')||t.fbclid?'Meta Ads':'Meta orgânico';
  else if(t.utm_source) ch=(t.utm_medium?t.utm_medium+' · ':'')+t.utm_source;
  else if(external&&/google|bing|yahoo|duckduckgo|ecosia/.test(host)) ch='Busca orgânica';
  else if(external&&/chatgpt|openai|perplexity|gemini|copilot|claude/.test(host)) ch='IA';
  else if(external) ch='Referência: '+host;
  t.channel=ch;
  var now=Date.now(), ft=get('bmc_ft');
  if(!ft||now-Date.parse(ft.ts)>TTL){ft=t; put('bmc_ft',ft)}
  var lt=get('bmc_lt'); if(signal||!lt){lt=t; put('bmc_lt',lt)}
  // Meta: monta o _fbc a partir do fbclid se o pixel ainda não criou
  var fbc=ck('_fbc')||(t.fbclid?'fb.1.'+now+'.'+t.fbclid:'');
  var ga=(ck('_ga').split('.').slice(-2).join('.'))||'';
  var A={first:ft,last:lt,session_landing:t.landing+location.search,fbp:ck('_fbp'),fbc:fbc,ga_client_id:ga,hutk:ck('hubspotutk'),
    device:/Mobi|Android|iPhone|iPad/i.test(navigator.userAgent)?'mobile':'desktop',screen:screen.width+'x'+screen.height,lang:navigator.language};
  window.BMC_ATTR=A;
  window.dataLayer=window.dataLayer||[];
  window.dataLayer.push({event:'bmc_attribution',first_channel:ft.channel,last_channel:lt.channel,utm_campaign:lt.utm_campaign||'',utm_content:lt.utm_content||'',device:A.device});
})();
;

/* mostra no rodapé qualquer erro de script (diagnóstico em aparelho real) */
window.__errs=[];window.addEventListener('error',function(e){window.__errs.push(e.message?(e.message+(e.lineno?' @'+e.lineno:'')):('não carregou '+((e.target&&(e.target.src||e.target.href))||'recurso').split('/').pop()));var b=document.querySelector('.build');if(b)b.textContent+=' · ERRO: '+window.__errs[window.__errs.length-1]},true);
document.addEventListener('DOMContentLoaded',function(){var b=document.querySelector('.build');if(b&&window.__errs.length&&b.textContent.indexOf('ERRO')<0)b.textContent+=' · ERRO: '+window.__errs.join(' | ')});
