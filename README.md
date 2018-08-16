## Yet another Entelect Challenge 2018 Visualiser

It's a bit late to the party, but as the title suggests, here is yet another visualiser for the [Entelect Challenge 2018 - Tower Defence](https://challenge.entelect.co.za/). 

It's built in JavaScript using the powerfull [D3 JS](https://d3js.org/) library and SVG. I used the visualiser as a pet project to learn some D3.

It is hosted in **GitHub Pages**, built from the **master** branch. Here is the Url: https://neilcrusty.github.io/TowerDefence/

I hope others find it useful in replaying their matches and honing their strategies.

### Screenshot

![Image of the game map](/assets/map_view.png?raw=true)

### How to use it


1. Follow the instructions on the [Entelect Challenge](https://challenge.entelect.co.za/) website. Download the starter pack and run your first bot match.
2. Each time you run a match a **timestamped** folder is created under the tower-defence-matches folder. i.e. \tower-defence-matches\\**2018.08.14.14.52.31**
3. In the [Visualiser](https://neilcrusty.github.io/TowerDefence/), click on the **Load Match** button and select a match folder. The `JsonMap.json` files for all the rounds will be used to render the game map.
4. The **Next Round** and **Previous Round** buttons will allow you to step through the match.
5. Hovering over buildings and missiles will show a tooltip with extra information.


### Disclaimer ###

The source code is public and open. There is no storing of match logs so your strategies are safe. :wink: You are welcome to clone the repo and run it locally via your pc's file system
