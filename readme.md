# Automaattinen sivustotehdas podcastille
Tällä repositoriolla voit luoda _helposti_ automaattisen, nopean ja saavutettavan verkkosivuston podcastillesi.

Sivusto on rakennettu Next.js:llä ja Material UI:lla. Sivusto hyödyntää SSR ja ISR -tekniikoita, joilla sivusto on salaman nopea käyttää. Kaikki sivuston data haetaan automaattisesti podcastin RSS-syötteestä.

Kehitykseen olen käyttänyt Anchorista saatavaa RSS-syötettä, jolla sivusto on testattu toimivaksi. Jos käytät jotain muuta alustaa RSS-syötteen generoimiseen ja sisältöä jää puuttumaan, arvostaisin jos kertoisit asiasta tämän repositorion Issues-ominaisuudella.

Sivusto on suomenkielinen. Kansainvälinen versio sivustotehtaasta on työnalla ja linkki lisätään tähän sen valmistuttua.

## Julkaise sivusto Vercelissä
[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2Foskarijarvelin%2Fnext-podcast-mui&env=PODCAST_RSS_URL&envDescription=RSS-feed%20URL%20from%20your%20podcast%20settings%20in%20Anchor)

Painiketta painamalla voit kloonata sivuston omalle Vercel-tilillesi ja vaihtaa oman podcastisi RSS-syötteen PODCAST_RSS_URL -ympäöristömuuttujaan.

## Kuinka julkaista oma sivusto?
1. Luo Github-tili
2. Luo Vercel-tili
3. Luo Anchor-tili ja julkaise podcastistasi vähintään ensimmäinen jakso
4. Paina Deploy with Vercel -painiketta
5. Syötä Anchorista podcastin asetuksista löytyvä RSS-syötteen URL-osoite projektin PODCAST_RSS_URL-nimiseen ympäristömuuttujaan (Enviromental Variables)
6. Sivusto rakentuu ja hakee sisällön automaattisesti RSS-syötteestä aina kun uusia jaksoja julkaistaan.