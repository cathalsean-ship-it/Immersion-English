#!/usr/bin/env python3
"""Share images (public/og/*.jpg) shown when a page is posted on Facebook,
WhatsApp, Viber etc. Run from anywhere:  python3 scripts/make-og-cards.py
Needs: pip install pillow fonttools brotli

House style: dark-green gradient left, photo right, eyebrow with an orange dot
before every item (all the same size), headline with orange highlights, logo +
"Immersion English". No URL on the card: the apps print the domain under it.
After changing a card, run the page through Facebook's Sharing Debugger and
click Scrape Again, or Facebook keeps the old image for days.
"""
import os, io
from PIL import Image, ImageDraw, ImageFont, ImageOps
from fontTools.ttLib import TTFont
ROOT=os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
R=os.path.join(ROOT,'public')
def _font(name):
    f=TTFont(os.path.join(R,'fonts',name+'.woff2')); f.flavor=None
    b=io.BytesIO(); f.save(b); return b.getvalue()
_FONTS={n:_font(n) for n in ['montserrat-latin-700-normal','montserrat-latin-600-normal','lato-latin-400-normal']}
W,H=1200,630; BG=(20,32,26); ORANGE=(255,145,76); WHITE=(255,255,255)
H700=lambda s:ImageFont.truetype(io.BytesIO(_FONTS['montserrat-latin-700-normal']),s)
H600=lambda s:ImageFont.truetype(io.BytesIO(_FONTS['montserrat-latin-600-normal']),s)
BODY=lambda s:ImageFont.truetype(io.BytesIO(_FONTS['lato-latin-400-normal']),s)

def cover(path, scale=None, x0=None, y0=None):
    im=ImageOps.exif_transpose(Image.open(path)).convert('RGB')
    s=scale or max(W/im.width,H/im.height)
    im=im.resize((round(im.width*s),round(im.height*s)),Image.LANCZOS)
    x=(im.width-W)//2 if x0 is None else x0; y=(im.height-H)//2 if y0 is None else y0
    return im.crop((x,y,x+W,y+H))

def shade(img, left=235, right=60, start=0.25, end=0.8):
    over=Image.new('RGBA',(W,H)); d=ImageDraw.Draw(over)
    for x in range(W):
        t=x/W
        a=left if t<start else right if t>end else int(left-(t-start)/(end-start)*(left-right))
        d.line([(x,0),(x,H)],fill=BG+(a,))
    return Image.alpha_composite(img.convert('RGBA'),over).convert('RGB')

def text(img, kicker_parts, lines, size=60, y_kicker=None, caption=None, max_w=820):
    d=ImageDraw.Draw(img); x=72
    while size>40 and max(sum(d.textlength(t,font=H700(size)) for t,_ in line) for line in lines)>max_w:
        size-=2
    n=len(lines); block=n*int(size*1.23)
    y_k = y_kicker if y_kicker is not None else (H - 110 - block - 56)//2 + 20
    # kicker: orange dot, then parts separated by orange middle dots
    d.ellipse([x,y_k+8,x+12,y_k+20],fill=ORANGE)
    cx=x+24; f=H600(22)
    for i,p in enumerate(kicker_parts):
        if i:
            cx+=12; d.ellipse([cx,y_k+8,cx+12,y_k+20],fill=ORANGE); cx+=24
        d.text((cx,y_k),p,font=f,fill=WHITE); cx+=d.textlength(p,font=f)
    y=y_k+54
    for line in lines:
        cx=x
        for t,c in line:
            d.text((cx,y),t,font=H700(size),fill=c); cx+=d.textlength(t,font=H700(size))
        y+=int(size*1.23)
    if caption:
        d.text((W-300,H-70),caption[0],font=H600(20),fill=WHITE)
        d.text((W-300,H-44),caption[1],font=BODY(17),fill=(220,220,220))
    logo=Image.open(f'{R}/ie-logo-192.png').convert('RGBA').resize((52,52),Image.LANCZOS)
    img.paste(logo,(x,530),logo)
    d.text((x+70,540),'Immersion English',font=H700(24),fill=WHITE)
    return img

def lenny(kicker, lines, out):
    img=Image.new('RGB',(W,H),BG)
    p=ImageOps.exif_transpose(Image.open(f'{R}/team-lenny.jpg')).convert('RGB')
    pw=520; ph=int(p.height*pw/p.width); p=p.resize((pw,ph),Image.LANCZOS)
    top=int(ph*0.04); p=p.crop((0,top,pw,top+H)); x0=W-pw; img.paste(p,(x0,0))
    fade=Image.new('L',(W,H),0); fd=ImageDraw.Draw(fade)
    for i in range(220): fd.line([(x0+i,0),(x0+i,H)],fill=int(255*(1-i/220)**1.6))
    fd.rectangle([0,0,x0,H],fill=255)
    img=Image.composite(Image.new('RGB',(W,H),BG),img,fade)
    text(img,kicker,lines,y_kicker=182,max_w=640,caption=('Cathal (Lenny) Leonard','Founder · CELTA-qualified'))
    img.save(out,'JPEG',quality=86,optimize=True,progressive=True)

# Homepage
img=shade(cover(f'{R}/teens-cafe.jpg'),left=230,right=70,start=0.3,end=0.85)
text(img,['English lessons','Dublin Summer for teens'],
     [[('Confident English comes',WHITE)],[('from ',WHITE),('using',ORANGE),(' it.',WHITE)],[('Not ',WHITE),('memorising',ORANGE),(' it.',WHITE)]])
img.save(f'{R}/og/home.jpg','JPEG',quality=86,optimize=True,progressive=True)

# About + Lessons (Lenny cards)
lenny(['CELTA-qualified','10+ years','Native speaker'],[[('The teacher behind',WHITE)],[('Immersion',ORANGE),(' English',WHITE)]],f'{R}/og/about.jpg')
lenny(['Individual','Corporate','Teens'],[[('Speaking-focused',ORANGE)],[('English lessons',WHITE)],[('with Lenny',WHITE)]],f'{R}/og/lessons.jpg')

# Dublin
img=shade(cover(os.path.join(ROOT,'src/assets/dublin-welcome-group.jpg'),scale=0.782,x0=0,y0=170),left=235,right=35,start=0.25,end=0.8)
text(img,['Dublin, Ireland','7, 10 or 14 days'],[[('Dublin Summer ',WHITE),('2027',ORANGE)],[('for teens aged 12–17',WHITE)]],y_kicker=216)
img.save(f'{R}/og/dublin-summer-2027.jpg','JPEG',quality=86,optimize=True,progressive=True)


def photo_card(src, kicker, lines, out, size=60):
    img=shade(cover(os.path.join(R,src)),left=232,right=70,start=0.3,end=0.85)
    text(img,kicker,lines,size=size)
    img.save(os.path.join(R,'og',out),'JPEG',quality=86,optimize=True,progressive=True)

W_=WHITE; O_=ORANGE
photo_card('teens-dublin.jpg',['Dublin Summer 2027','Accommodation'],[[('En-suite campus living',W_)],[('in the ',W_),('heart of Dublin',O_)]],'accommodation.jpg')
photo_card('dublin-street.webp',['Dublin Summer 2027','Excursions'],[[('Trips & activities:',W_)],[('Dublin, properly.',O_)]],'trips-and-activities.jpg',size=64)
photo_card('teens-cafe.jpg',['Dublin Summer 2027','Weekly programme'],[[('Something new',W_)],[('every day.',O_)]],'weekly-programme.jpg',size=64)
photo_card('students-walking.jpg',['Dublin Summer 2027','FAQs'],[[('Questions parents ask',W_)],[('about ',W_),('Dublin Summer',O_)],[('2027',O_)]],'faqs.jpg',size=56)
photo_card('teens-cafe.jpg',['Contact','Immersion English'],[[('Book a ',W_),('free',O_)],[('consultation',W_)]],'contact.jpg',size=64)
photo_card('corporate-hero.jpg',['Corporate training','Sofia'],[[('Corporate English',W_)],[('training for ',W_),('teams',O_)]],'corporate-training.jpg',size=64)
photo_card('dublin-street.webp',['English learning','Insights'],[[('The Immersion',W_)],[('English ',W_),('blog',O_)]],'blog.jpg',size=64)
photo_card('blog-ai.jpg',['Blog'],[[('AI and the ',W_),('human touch',O_)],[('in language learning',W_)]],'blog-ai.jpg',size=56)
photo_card('blog-cefr.jpg',['Blog'],[[('CEFR levels explained:',W_)],[('what ',W_),('B2 and C1',O_),(' really',W_)],[('mean',W_)]],'blog-cefr.jpg',size=56)
photo_card('blog-conversation.jpg',['Blog'],[[('How small talk builds big',W_)],[('confidence',O_),(' in English',W_)]],'blog-conversation.jpg',size=56)
photo_card('blog-ielts.jpg',['Blog'],[[('IELTS',O_),(' preparation tips for',W_)],[('Bulgarian students',W_)]],'blog-ielts.jpg',size=56)
photo_card('dublin-street.webp',['Blog'],[[('Why ',W_),('Ireland',O_),(' is one of the',W_)],[('best places to learn',W_)],[('English',W_)]],'blog-ireland.jpg',size=56)
photo_card('blog-speaking-harder.jpg',['Blog'],[[('Why ',W_),('speaking',O_),(' feels',W_)],[('harder than reading or',W_)],[('listening',W_)]],'blog-speaking-harder.jpg',size=56)
print('all 17 cards built')
