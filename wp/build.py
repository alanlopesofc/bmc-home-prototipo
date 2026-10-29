"""Gera os arquivos da home B para o WordPress a partir de b/index.html.
Saída: wp/home-b.css, wp/home-b-early.js, wp/home-b-main.js (servidos pelo jsDelivr)
e wp/home-b-shell.html (estrutura colada na página, com {CDN} no lugar da base do jsDelivr)."""
import re, json, os
os.chdir(os.path.dirname(os.path.abspath(__file__)) + '/..')
s = open('b/index.html').read()
U = 'https://bmchyundai.com.br/wp-content/uploads/2026/10/home-b-'
style = s[s.index('<style>'):s.index('</style>') + 8]
body = s[s.index('<body'):]; body = body[body.index('>') + 1:body.rindex('</body>')]
fonts = ('<link rel="preconnect" href="https://fonts.googleapis.com"><link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>'
         '<link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600&family=Montserrat:wght@600;700;800&display=swap" rel="stylesheet">')
out = style + body
out = out.replace("'../assets/bg/'+c.id+'.webp'", "'" + U + "bg-'+c.id+'.webp'").replace("A='../assets/m/'", "A='" + U + "m-'")
out = re.sub(r"\.\./assets/js/(gsap|ScrollTrigger|ScrollToPlugin)\.min\.js", lambda m: "https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.5/" + m.group(1) + ".min.js", out)
out = re.sub(r"\.\./assets/([a-z0-9-]+)\.(webp|mp4)", lambda m: U + m.group(1) + "." + m.group(2), out)
assert '../assets' not in out
out = re.sub(r'<p class="proto">.*?</p>\s*', '', out, flags=re.S)
out = re.sub(r'<span class="bh build">.*?</span>\s*', '', out)
guard = open('wp/guard.css').read()
out = out.replace('</style>', guard + '</style>', 1)
css = re.search(r'<style>(.*?)</style>', out, re.S).group(1)
rest = out[out.index('</style>') + 8:]
scripts = re.findall(r'<script>(.*?)</script>', rest, re.S)
early = ';\n'.join(scripts[:-1]); main = scripts[-1]
g = re.search(r'<g class="ufs">(.*?)</g>', rest, re.S)
rest = rest.replace(g.group(0), '<g class="ufs" id="bhUfs"></g>')
main = "document.getElementById('bhUfs')&&(document.getElementById('bhUfs').innerHTML=" + json.dumps(g.group(1)) + ");\n" + main
markup = re.sub(r'<script>.*?</script>\s*', '', rest, flags=re.S)
gsap = re.findall(r'<script src="https://cdnjs[^"]+"></script>', markup)
markup = re.sub(r'<script src="https://cdnjs[^"]+"></script>\s*', '', markup)
shell = (fonts + '<link rel="stylesheet" href="{CDN}home-b.css"><script src="{CDN}home-b-early.js"></script>'
         + markup.strip() + ''.join(gsap) + '<script src="{CDN}home-b-main.js"></script>')
open('wp/home-b.css', 'w').write(css); open('wp/home-b-early.js', 'w').write(early); open('wp/home-b-main.js', 'w').write(main)
open('wp/home-b-shell.html', 'w').write(shell)
print('css', len(css), 'early', len(early), 'main', len(main), 'shell', len(shell))
