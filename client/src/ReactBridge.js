import io from 'socket.io-client';

class ReactBridge {
    constructor(url) {
        this.socket = io(url);
        console.log("lan");
    }

    execute(command, args) {
        const resultEvent = `${command}-result`;
        const errorEvent = `${command}-error`;

        return new Promise((resolve, reject) => {
            this.socket.emit(command, args);

            this.socket.once(resultEvent, (data) => {
                resolve(data);
            });

            this.socket.once(errorEvent, (error) => {
                reject(error);
            });
        });
    }

    on(event, callback, done) {
        this.socket.on(event, (data) => {
            callback(data);
        });
        const doneEvent = `${event}-done`;
        this.socket.once(doneEvent, () => {
            done();
            this.off(event);
        });
    }

    off(event) {
        this.socket.off(event);
    }
}

export default ReactBridge;