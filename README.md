# Resort Booking

### Official version
* Visit via browser: resort-reservation.netlify.app

## Requirement list before run this application:
* Node server
* MongoDB via (https://www.mongodb.com/cloud/atlas)
    * Remember to follow exact inital steps
    * Remember to allow IP address to access your Database(DB) ( via https://i.ibb.co/Prxrv1P/Screen-Shot-2020-06-09-at-21-14-19.png) 
   
## Instruction feature
* View rooms based on categories :
    * Room type: single, double, family, presidental
    * Number of guest
    * Room price
    * Room size
    * Other service: Pet allowance, breakfast
* Login and register for booking, cancel rooms.
* Booking rooms, cancel booking rooms ( only authentic account).
    
### Tech Stacks
* Language: Javascript, Html/Css
* ReactJS
* NodeJS
* MongoDB Cloud
* GraphQL
* Heroku server

### Run the app
* Clone the respo: `git clone https://github.com/riofed5/Hotel-booking.git`
* Install packages: `npm install`
* Create file `nodemon.json` and then copy follow lines into `nodemon.json` file:

```
{
    "env":{
        "MONGO_USER": "your_user",
        "MONGO_PASSWORD": "your_password",
        "MONGO_DB": "booking" //Don't change it!
    }
}
```
* Launch server : `npm start`
* If you can NOT connect to server, please check file `server.js` for ``connect(`mongodb+srv://${process.env.MONGO_USER}:${process.env.MONGO_PASSWORD}@booking-t8fkm.gcp.mongodb.net/${process.env.MONGO_DB}?retryWrites=true&w=majority`)`` to be the same as yours in database(link to get yours https://i.ibb.co/5KKx1Pz/Screen-Shot-2020-06-18-at-16-23-08.png)
* Launch client: 
   * Navigate to `frontend folder`
   * Launch: `npm start`

