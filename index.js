class Distributor{
    constructor(defaultFn, switchObj){
        this.defaultFn = defaultFn;
        this.switchObj = switchObj;
        this.funcColl = [];
    }
    
    static create(defaultFn){
        return new Distributor(defaultFn);
    }

    add(key, value){
        this.funcColl.push({key : key, value : value});
        return this;
    }

    controller(wrappedMessage){
        for(let i = 0; i < this.funcColl.length; i++){
            if(this.funcColl[i].key === wrappedMessage.message.content){
                return this.funcColl[i].value(wrappedMessage);
            }
        }
        return this.defaultFn(wrappedMessage);
    }

}

class Handler{
    constructor(defaultDistrubutor){
        this.distributors = [];
        this.defaultDistrubutor = defaultDistrubutor;
    }

    static create(defaultDistrubutor){
        return new Handler(defaultDistrubutor);
    }

    add(key, value){// key === flag of the distributor, will be the system of connection keys-distributors
        this.distributors.push({key : key, value : value});
        return this;
    }

    controller(wrappedMessage){
        const content = wrappedMessage.message.content;
        for(let key in wrappedMessage.flagStorage){
            if(wrappedMessage.flagStorage[key]) // if some flag is up this will happen
                
                for(let i = 0; i < this.distributors.length; i++){
                    if(this.distributors[i].key===key){
                        return this.distributors[i].value.controller(wrappedMessage);
                    }
                }

        }
        return this.defaultDistrubutor.controller(wrappedMessage);
    }
}

const fn0 = (wrappedMessage) => {
    wrappedMessage.flagStorage.flag = true;
    console.log('this is fn #0, state is up!');
}

const fn1 = (wrappedMessage) => {
    console.log('this is fn #1, userID is: ' + wrappedMessage.message.userID);
}

const fn2 = (wrappedMessage) => {
    console.log('this is fn #2, message content is: ' + wrappedMessage.message.content);
}

const defaultFn = (wrappedMessage) => console.log('no such command: ' + wrappedMessage.message.content)

const wrappedMessage = {
    flagStorage : {
        flag : true,
    },
    message : {
        userID : 0831,
        content : 'userID',
    },
}

// Usage

const defaultDistrubutor = Distributor
    .create(defaultFn)
    .add('change flag', fn0);

const notDefaultDistributor = Distributor
    .create(defaultFn)
    .add('userID', fn1)
    .add('message content', fn2);

const handler = Handler.create(defaultDistrubutor) // works if flag is false
    .add('flag', notDefaultDistributor); // works if flag is true

handler.controller(wrappedMessage);