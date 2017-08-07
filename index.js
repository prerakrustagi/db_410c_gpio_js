var fs = require('fs');

module.exports = (function() {
    // MODULE GLOBALS
    var _GPIOList = [];
    var _mapGPIOPins = {
        23: '36', 24: '12', 25: '13', 26: '69', 27: '115', 28: '901',
        29: '24', 30: '25', 31: '35', 32: '34', 33: '28', 34: '33'
    };

    var GPIO = function(pinNumber) {
        var PATH = "/sys/class/gpio/";

        var __openPin = function(cb) {
            if(_GPIOList.indexOf(pinNumber) !== -1) {
                if(typeof cb === 'function') { cb(null); }
            } else {
                fs.writeFile(PATH + 'export', _mapGPIOPins[pinNumber], function(err) {
                    if(err) {
                        console.log(err);
                        if(typeof cb === 'function') { cb(err); }
                    } else {
                        _GPIOList.push(pinNumber);
                        console.log( 'Pin : ' + pinNumber + ' opened successfully');
                        if(typeof cb === 'function') { cb(null); }
                    }
                });
            }
        };

        var __closePin = function(cb) {
            if(GPIOList.indexOf(pinNumber) !== -1) {
                fs.writeFile(PATH + 'unexport', _mapGPIOPins[pinNumber], function(err) {
                    if(err) {
                        console.log(err);
                        if(typeof cb === 'function') { cb(err); }
                    } else {
                        _GPIOList.splice(_GPIOList.indexOf(pinNumber), 1);
                        console.log( 'Pin : ' + pinNumber + ' closed successfully');
                        if(typeof cb === 'function') { cb(null); }
                    }
                });
            } else {
                if(typeof cb === 'function') { cb(null); }
            }
        };

        var __setDirection = function(direction) {
            fs.writeFile(PATH + 'gpio' + _mapGPIOPins(pinNumber) + "/direction", direction, function(err) {
                if(err) {
                    console.log(err);
                    if(typeof cb === 'function') { cb(err); }
                } else {
                    console.log( 'Direction: ' + direction + ' set for pin: ' + pinNumber);
                    if(typeof cb === 'function') { cb(null); }
                }
            });
        };

        var __getDirection = function() {
            fs.readFile(PATH + 'gpio' + _mapGPIOPins(pinNumber) + "/direction", function(err, direction) {
                if(err) {
                    console.log(err);
                    if(typeof cb === 'function') { cb(err); }
                } else {
                    console.log( 'Direction for pin: ' + pinNumber + ' is ' + direction);
                    if(typeof cb === 'function') { cb(null, direction); }
                }
            });
        };

        var __setValue = function(value) {
            fs.writeFile(PATH + 'gpio' + _mapGPIOPins(pinNumber) + "/value", value, function(err) {
                if(err) {
                    console.log(err);
                    if(typeof cb === 'function') { cb(err); }
                } else {
                    console.log( 'Value for pin: ' + pinNumber + ' is set to ' + value);
                    if(typeof cb === 'function') { cb(null); }
                }
            });
        };

        var __getValue = function() {
            fs.readFile(PATH + 'gpio' + _mapGPIOPins(pinNumber) + "/value", function(err, value) {
                if(err) {
                    console.log(err);
                    if(typeof cb === 'function') { cb(err); }
                } else {
                    console.log( 'Value for pin: ' + pinNumber + ' is ' + value);
                    if(typeof cb === 'function') { cb(null, value); }
                }
            });
        };

        return {
            'openPin': __openPin,
            'closePin': __closePin,
            'setDirection': __setDirection,
            'getDirection': __getDirection,
            'setValue': __setValue,
            'getValue': __getValue
        };
    };

    /**
     * The getPin method is used to create a GPIO object. After a GPIO is
     * created it is added to a list to keep track of all GPIO's being used.
     */
    var __getPin = function(pinNumber, cb) {
        var gpioPin = GPIO(pinNumber);
        gpioPin.openPin(function(err) {
            if(err) {
                if(typeof cb === 'function') { cb(err); }
            } else {
                _GPIOList.push(pinNumber);
                if(typeof cb === 'function') { cb(null, gpioPin); }
            }
        })
    };

    var __cleanup = function(cb) {
        var openPins = GPIOList.slice();
        var openPinCount = openPins.count;
        var error;
        for(var i in openPins) {
            var pin = GPIO(openPins[i]);
            pin.setDirection('in', function(err) {
                if(!err) {
                    pin.closePin(function(err) {
                        error = err
                        openPinCount -= 1;
                        if(openPinCount === 0) {
                            if(typeof cb === 'function') { cb(error); }
                        }
                    });
                } else {
                    error = err;
                    openPinCount -= 1;
                    if(openPinCount === 0) {
                        if(typeof cb === 'function') { cb(error); }
                    }
                }
            });
        }
    };

    return {
        'getPin': __getPin,
        'cleanup': __cleanup
    };
}) ();

return module.exports;
