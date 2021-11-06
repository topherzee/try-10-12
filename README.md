GOALS ******************************

Stack Builder.
* 10 ordered DX Cards.
* Save to Magnolia.

Add DX Cards.

Stack Solution Builder
* 1,2,5,10 DX Cards. Linked Tech Cards.

Board
* Arbitrary cards anywhere. + Text Everywhere.
* Save to Magnolia.
* Create boards for 5 existing Magnolia Projects. 

Epic Win game
* Start game. 
* Multiplayer.
* Store results for later AI.



Status *****************************

CODE THIS NEXT ********************************

Save a board (with card positions and notes)

Mobile Version.

Add DX Cards.

Make a board. (Miro style)
https://github.com/bokuweb/react-rnd

https://github.com/beizhedenglong/reactablejs
https://interactjs.io/
https://www.npmjs.com/package/react-draggable

(Interesting: https://github.com/tajo/react-movable)

CODE ACCOMPLISHED ******************

2021-11-05

Board Layout
Add MULTIPLE cards of the same kind to board by click on tech deck.
Remove a card from a board.
Click on a card to see a full sized card.

2021-10-30

Styling. Shrink cards a bit. borders etc.

Refactor code a bit.

2021-10-29



Got system running on SaaS + Netlify (But cannot save on SaaS, currently.)
Save the hand to Magnolia Contenttype.
Each user has a folder. Each folder can store multiple hands.


2021-10-26

Change 'hand' selection to be based on ID's not names.
2021-10-25

Reorder the hand.

Some quickk filters to look at certain types of cards.

Create hands contenttype, app, restEndpoint

------ PREVIOUSLY ......

It is loading a TSV file

It is adding items to Magnolia via REST request.

It appears to load most the Experience and UI items.

_*Column Formatter*_

appears to be the first item that does not get properly imported to Magnolia.
BUT - its not loading all of the Integration and Backend - why not?
FIXED - trimmed out spaces and replaced '/' with '-'.

Content is in!
http://localhost:8080/magnoliaAuthor/.rest/delivery/tech

Created new 'simple' project.

NEXT - Create SPA to render list of items.
NEXT - Create SPA to render single item.

Working on this URL
http://localhost:8080/magnoliaAuthor/.rest/delivery/tech/tech/Experience/Page%20template

fCOOL we have importing and rendering all carfds
We have selection based on toggling in the deck.

Nexgt RENDER big and on the top or side - which cards are selected. - the HAND.