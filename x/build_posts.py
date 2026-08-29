#!/usr/bin/env python3
"""Renders posts 02-14. All figures computed here; headlines built from the results."""
from PIL import Image, ImageDraw, ImageFont
import glob, math
HANDLE="@moneydecoded"; CUR="£"
NAVY=(0x16,0x20,0x3C); GOLD=(0xE8,0xA3,0x3D); OFFW=(0xF4,0xF1,0xEA)
MUT=(0x6B,0x77,0x93); DIM=(0x9F,0xAB,0xC4); RED=(0xC8,0x5A,0x54); BOX=(0x22,0x2E,0x50)
B=glob.glob("/usr/share/fonts/**/DejaVuSans-Bold.ttf",recursive=True)[0]
def F(s): return ImageFont.truetype(B,s)
def w(d,t,f): return d.textbbox((0,0),t,font=f)[2]
def fit(d,t,limit,start):
    for s in range(start,11,-1):
        if w(d,t,F(s))<limit: return F(s)
    return F(12)
def wrap(d,t,f,limit):
    out,cur=[],""
    for word in t.split():
        trial=(cur+" "+word).strip()
        if w(d,trial,f)<=limit: cur=trial
        else: out.append(cur); cur=word
    if cur: out.append(cur)
    return out

def card(kick,h1,h2=None):
    P=Image.new("RGB",(1080,1080),NAVY); d=ImageDraw.Draw(P)
    d.text((90,88),kick,font=F(30),fill=GOLD)
    d.text((90,142),h1,font=fit(d,h1,930,54),fill=OFFW)
    if h2: d.text((90,212),h2,font=fit(d,h2,930,54),fill=GOLD)
    return P,d
def foot(P,d,take,notes):
    d.text((90,884),take,font=fit(d,take,940,32),fill=DIM)
    y=936
    for n in notes:
        d.text((90,y),n,font=fit(d,n,940,23),fill=MUT); y+=30
    d.text((90,1022),HANDLE,font=F(26),fill=MUT)
def money(v): return f"{CUR}{v:,.0f}"
def years(v): return f"{v:.0f} yrs"
def bars(d,items,top=380,base=830,x0=150,bw=270,gap=180,fmt=money):
    mx=max(v for _,v,_ in items)
    for i,(lab,v,c) in enumerate(items):
        x=x0+i*(bw+gap); h=int((base-top)*v/mx)
        d.rectangle([x,base-h,x+bw,base],fill=c)
        n=fmt(v)
        d.text((x,base-h-70),n,font=fit(d,n,bw+120,54),fill=c)
        d.text((x,base+20),lab,font=fit(d,lab,bw+120,29),fill=OFFW)
    d.line([(x0,base),(1080-x0,base)],fill=DIM,width=3)
def diverge(d,items,zero=600,scale=160,x0=200,bw=280,gap=200):
    mx=max(abs(v) for _,v,_ in items)
    d.line([(90,zero),(990,zero)],fill=DIM,width=3)
    d.text((90,zero-34),"0",font=F(26),fill=DIM)
    for i,(lab,v,c) in enumerate(items):
        x=x0+i*(bw+gap); h=int(scale*abs(v)/mx)
        top,bot=(zero-h,zero) if v>0 else (zero,zero+h)
        d.rectangle([x,top,x+bw,bot],fill=c)
        n=("+" if v>0 else "-")+f"{CUR}{abs(v):,.0f}"
        d.text((x,top-64 if v>0 else bot+14),n,font=fit(d,n,bw+120,52),fill=c)
        ly=top-110 if v>0 else bot+72
        d.text((x,ly),lab,font=fit(d,lab,bw+140,28),fill=OFFW)

def chain(d,steps,top=310):
    n=len(steps); bh=int((860-top-(n-1)*20)/n)
    y=top
    for i,s in enumerate(steps):
        col=GOLD if i==n-1 else BOX
        d.rounded_rectangle([90,y,990,y+bh],radius=10,fill=col)
        f=fit(d,s,840,30)
        d.text((120,y+bh//2-f.size//2-2),s,font=f,fill=NAVY if i==n-1 else OFFW)
        if i<n-1:
            cy=y+bh+10
            d.line([(540,cy-6),(540,cy+6)],fill=DIM,width=4)
            d.polygon([(532,cy+2),(548,cy+2),(540,cy+14)],fill=DIM)
        y+=bh+20
def bignum(d,num,sub,y=440):
    f=fit(d,num,940,190)
    d.text((90,y),num,font=f,fill=GOLD)
    for i,l in enumerate(wrap(d,sub,F(34),900)):
        d.text((90,y+f.size+30+i*44),l,font=F(34),fill=OFFW)
def reframe(d,wrong,right):
    f=F(31); lw,lr=wrap(d,wrong,f,380),wrap(d,right,f,380)
    h=320+max(len(lw),len(lr))*42+130
    d.rounded_rectangle([90,320,530,h],radius=12,fill=BOX)
    d.rounded_rectangle([550,320,990,h],radius=12,fill=(0x1C,0x2A,0x4E),outline=GOLD,width=3)
    d.text((120,352),"WHAT YOU THINK",font=F(25),fill=RED)
    d.text((580,352),"WHAT'S HAPPENING",font=F(25),fill=GOLD)
    y=424
    for l in lw:
        d.text((120,y),l,font=f,fill=MUT)
        d.line([(118,y+20),(120+w(d,l,f)+4,y+20)],fill=RED,width=4); y+=42
    y=424
    for l in lr: d.text((580,y),l,font=f,fill=OFFW); y+=42

def ann(pmt,rate,yrs):  # future value of monthly contributions
    r=rate/12; n=yrs*12; return pmt*(((1+r)**n-1)/r)
def mpay(P,rate,yrs):
    r=rate/12; n=yrs*12; return P*r/(1-(1+r)**-n)
def months_to_clear(P,rate,pmt):
    r=rate/12; return -math.log(1-P*r/pmt)/math.log(1+r)

posts=[]
# 02 fee drag
g,lo,hi=0.05,0.002,0.015
a,b=ann(250,g-lo,30),ann(250,g-hi,30); pct=(a-b)/a*100
P,d=card("THE FEE YOU NEVER SEE",f"A 1.5% fee takes {pct:.0f}% of",f"everything you build.")
bars(d,[("0.2% FEE",a,MUT),("1.5% FEE",b,GOLD)])
foot(P,d,f"A {CUR}{a-b:,.0f} difference. Same contributions, same fund, same 30 years.",
 [f"{CUR}250/mo for 30 years, 5% return before fees and after inflation.",
  "Today's money. Illustrative, not a projection of any product."]); posts.append(("02-fee-drag",P))
# 03 real pay rise
sal,rise,infl=35000,0.03,0.038
nom,real=sal*(1+rise),sal*(1+rise)/(1+infl)
P,d=card("YOUR PAY RISE","You got 3%. Inflation got","more.")
diverge(d,[("ON PAPER",nom-sal,GOLD),("IN REAL TERMS",real-sal,RED)])
foot(P,d,f"{CUR}{nom-sal:,.0f} more on paper. {CUR}{sal-real:,.0f} less in what it buys.",
 [f"{CUR}{sal:,.0f} salary, 3% rise, inflation at {infl:.1%} — an illustrative rate, not current data.",
  "Check the real figure before you use this on yourself."]); posts.append(("03-real-pay-rise",P))
# 04 rate chain
P,d=card("HOW IT REACHES YOU","A rate rise you ignored","is in this week's shopping.")
chain(d,["The central bank raises the base rate","Lenders reprice business borrowing","Your supermarket's supplier pays more to finance stock",
 "The cost is passed into shelf prices","You pay it, and call it inflation"])
foot(P,d,"Nobody sends you the memo. You just notice the bill.",
 ["Illustrative transmission path. Real lags vary by sector, typically several months."]); posts.append(("04-rate-chain",P))
# 05 overpay
Pr,rt,yr=200000,0.05,25
base=mpay(Pr,rt,yr); n2=months_to_clear(Pr,rt,base+50)
saved=yr*12-n2; isav=(yr*12*base)-(n2*(base+50))
P,d=card("THE OVERPAY","An extra "+CUR+"50 a month",f"ends it {saved/12:.1f} years early.")
bignum(d,f"{CUR}{isav:,.0f}",f"less paid in total. You finish {saved/12:.1f} years early and hand over less money, not more.",y=400)
foot(P,d,f"Term falls from {yr} years to {n2/12:.1f}.",
 [f"{CUR}{Pr:,.0f} repayment mortgage at {rt:.0%} over {yr} years. Rate held flat for illustration.",
  "Check your lender allows penalty-free overpayments first."]); posts.append(("05-overpay",P))
# 06 inflation reframe
yrs,i=20,0.03; left=100/((1+i)**yrs)
P,d=card("THE REFRAME","Inflation isn't prices going up.","It's your money going down.")
reframe(d,"Things cost more than they used to. Annoying, but the money is the same money.",
 f"The money is smaller. {CUR}100 held for {yrs} years at {i:.0%} buys what {CUR}{left:,.0f} buys today.")
foot(P,d,"Same basket. Smaller coin. That's the whole mechanism.",
 [f"{i:.0%} assumed for illustration, compounded over {yrs} years."]); posts.append(("06-inflation-reframe",P))
# 07 rent vs buy
rent0,gr=1200*12,0.03
rent=sum(rent0*(1+gr)**k for k in range(30))
price,dep,mr=250000,0.10,0.05
loan=price*(1-dep); tot=mpay(loan,mr,30)*360+price*dep+2500*30
P,d=card("RENT vs BUY","Thirty years of each.",f"{CUR}{rent-tot:,.0f} apart.")
bars(d,[("RENT",rent,MUT),("BUY",tot,GOLD)])
foot(P,d,"And only one of them leaves you owning the house.",
 [f"Rent {CUR}{rent0/12:,.0f}/mo rising {gr:.0%}/yr. Buy {CUR}{price:,.0f}, {dep:.0%} down, {mr:.0%} over 30y, {CUR}2,500/yr upkeep.",
  "One scenario, not a recommendation. Change any input and the answer flips."]); posts.append(("07-rent-vs-buy",P))
# 08 BNPL
P,d=card("BUY NOW, PAY LATER","It isn't credit.","It's a pricing change.")
chain(d,["The provider charges the retailer 3-6% per sale","The retailer raises the shelf price to absorb it",
 "Everyone pays the higher price — including cash buyers","Late fees land on the people who could least afford it"])
foot(P,d,"You didn't get 0%. You got the cost moved somewhere you can't see it.",
 ["Merchant fee range is indicative and varies by provider and sector."]); posts.append(("08-bnpl",P))
# 09 savings rate
def yrs_to_fi(s,r=0.05):
    tgt=25*(1-s); return math.log(1+tgt*r/s)/math.log(1+r)
a9,b9=yrs_to_fi(0.10),yrs_to_fi(0.25); gap9=a9-b9
P,d=card("SAME SALARY","One finishes",f"{gap9:.0f} years earlier.")
bars(d,[("SAVING 10%",a9,MUT),("SAVING 25%",b9,GOLD)],top=480,fmt=years)
foot(P,d,"Not a better job. Not a better return. A bigger gap between earning and spending.",
 ["Years to 25x annual spending, 5% return after inflation, starting from zero.",
  "Bars are years to reach that target, not amounts."]); posts.append(("09-savings-rate",P))
# 10 pension fee
a10,b10=ann(250,0.05-0.002,40),ann(250,0.05-0.0075,40)
P,d=card("YOUR DEFAULT PENSION","The number nobody","showed you.")
bignum(d,f"{CUR}{a10-b10:,.0f}",f"the lifetime cost of a 0.75% charge instead of 0.2%.",y=430)
foot(P,d,"It was in the paperwork. It was never on the payslip.",
 [f"{CUR}250/mo for 40 years, 5% before charges, after inflation. Today's money.",
  "0.75% is the UK auto-enrolment charge cap; many defaults sit below it. Check yours."]); posts.append(("10-pension-fee",P))
# 11 sticker vs total
amt,apr,y11=20000,0.099,5
tot11=mpay(amt,apr,y11)*y11*12
P,d=card("STICKER vs TOTAL",f"The {CUR}{amt:,.0f} car",f"costs {CUR}{tot11-amt:,.0f} more than that.")
bars(d,[("PRICE",amt,MUT),("WHAT YOU PAY",tot11,GOLD)])
foot(P,d,f"{CUR}{tot11-amt:,.0f} of it is rent on money.",
 [f"{CUR}{amt:,.0f} borrowed at {apr:.1%} APR over {y11} years. Illustrative rate."]); posts.append(("11-sticker-vs-total",P))
# 12 mortgage bet
P,d=card("ONE NUMBER","Every mortgage is a bet.","Most people don't know on what.")
chain(d,["You fix your rate for 2 or 5 years","The fix ends on a date you agreed years ago",
 "You reprice at whatever the market is that month","That single number sets your payment for the next term"])
foot(P,d,"The bet isn't the house. It's the date your fix ends.",
 ["Applies to fixed-then-revert mortgages. Structures vary by country and product."]); posts.append(("12-mortgage-bet",P))
# 13 interest reframe
P,d=card("THE REFRAME","Interest isn't a fee","for borrowing.")
reframe(d,"A charge for the service of lending. Pay it back, it stops.",
 "A charge for time itself. It accrues whether you engage with it or not, and time does not pause.")
foot(P,d,"That's why the term matters more than the rate.",
 ["Conceptual. See the sticker-vs-total post for the arithmetic."]); posts.append(("13-interest-reframe",P))
# 14 afford the payment
mo=350; run=(800+1400+600)
tot14=mo*60+run*5
P,d=card("AFFORD THE PAYMENT?",f"{CUR}{mo} a month.",f"{CUR}{tot14:,.0f} in five years.")
bars(d,[("THE PAYMENT",mo*60,MUT),("THE ACTUAL COST",tot14,GOLD)])
foot(P,d,"The payment is the part they show you. The rest arrives quietly.",
 [f"{CUR}{mo}/mo finance over 5 years, plus {CUR}{run:,.0f}/yr insurance, fuel, tax and upkeep.",
  "Illustrative running costs. Yours will differ."]); posts.append(("14-afford-payment",P))

for name,img in posts: img.save(f"assets/post-{name}.png")
print("\n".join(n for n,_ in posts))
