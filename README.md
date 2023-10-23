# Examensarbete
## Info
Detta är repo:n för Måns Henrikssons examensarbete för TE4-23 på NTI Gymnasiet Odenplan.
## Idén
Idén är en slags tågsimulator med fokus på trafikledningsaspekten. Användare ska kunna bygga ett järnvägsnät med driftplatser och linjer, och sedan kunna köra tåg på nätet.
## Innehåll
### Driftplatser
- Spår och växlar
#### Tågvägar
- Växlar kan låsas för att lägga tågvägar.
- Ställverkstabeller används för att veta vilka tågvägar som kan läggas.
- Tågvägar som delar minst en spårsektion kan inte läggas.
- Signaler visar för tåg att tågvägar är lagda.
- Tågvägar går till och från mellan-, utfarts- eller infartssignaler.
#### Signaler
- Utfartssignaler är blocksignaler som visar ifall den första blocksträckan utanför driftplatsen är ledig.
- Infartssignaler ligger på gränsen in till driftplatsen och visar om ett tåg får komma in på driftplatsen.
- Signalerna inom driftplatsen har också blocksignalfunktioner, alltså att de inte kan visa grönt till ett spår som är upptaget.
### Linjen
- Automatisk blocksignallering.
- Dubbelriktad signallering.
### Gränssnitt
- Driftplatser visas som noder som kan expanderas och minimeras.
- Linjer är kopplingar mellan noderna och kan ha olika antal spår.
### Trafik
- Tåg ska kunna köra automatiskt
- Följa tidtabeller