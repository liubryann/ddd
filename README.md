# Due Diligence for Dummies

Keep up with trending stocks through sentiment analyis.

## Upcoming Changes 
* Mobile support 
* Hot and trending stocks discovery 

## Feature Backlog 
* Enchanced stock search assistance 
* Add more analytics such as Range, Volume, Market Cap etc.
* Reduce queries to <1s with Redis cache
* Refine the sentiment model for more accurate predictions 

## Bug Backlog
* Fix cramped dates on stock chart in small screens


## Release Notes

### 0.2.0
* Brand new UI 
  * Added stock chart and price analytics using data from Yahoo Finance
  * Added new sentiment summary cards in a carousel
* Backend refactor
  * Completely replaced Node.js with Flask because majority of the analytics are done in Python
  * Multithreaded the webscraper and sentiment prediction reducing average time from 130s to 3s

*Decemember 30, 2020*

### 0.1.0
* Initial release for HackWestern 7 

*November 23, 2020*

## Demo

<img src=dddemo.gif height="400" width="auto">

