# Dragon Board 410C - GPIO Library
This is a basic library in NodeJS to interact with the GPIO pins on the DragonBoard 410C.

## How to use

````
DB410C.GPIOProcessor.getPin(33, function(err, pin) {
    if(!err) {
        var pin33 = pin;
        pin33.setDirection('in', cb);
        pin33.setValue(1, function(err) {
            // Do something
        });
        pin33.setValue(0, function(err) {
            // Do something
        });
        pin33.getValue(function(err, val) {
            // do something
        });        
    }
}) 
