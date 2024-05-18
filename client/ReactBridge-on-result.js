import io from 'socket.io-client';

class ReactBridge {
    constructor(url) {
        this.socket = io(url);
        this.eventCallbacks = {};
    }

    execute(command, args) {
        const resultEvent = `${command}-result`;
        const errorEvent = `${command}-error`;

        this.eventCallbacks = {};

        this.socket.emit(command, args);

        const executeContext = {
            on: (event, callback) => {
                if (event === 'result') {
                    this.eventCallbacks.result = callback;
                    this.socket.once(resultEvent, (data) => {
                        this.eventCallbacks.result(data);
                    });
                } else if (event === 'error') {
                    this.eventCallbacks.error = callback;
                    this.socket.once(errorEvent, (error) => {
                        this.eventCallbacks.error(error);
                    });
                }
                return executeContext; // Burayı değiştirdim
            },
        };

        return executeContext;
    }
}

export default ReactBridge;