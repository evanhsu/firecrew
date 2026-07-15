export type LogLevel = 'debug' | 'info' | 'error';
export class LoggerConstructor {
    public debug(...data: any[]) {
        if (!import.meta.env.PROD) {
            this.log('debug', ...data);
        }
    }

    public info(...data: any[]) {
        this.log('info', ...data);
    }

    public error(...data: any[]) {
        this.log('error', ...data);
    }

    public log(level: LogLevel, ...data: any[]) {
        // Send logs to an aggregation service here

        if (level === 'error') {
            console.error(`[${level}]`, ...data);
        } else {
            console.log(`[${level}]`, ...data);
        }
    }
}

const logger = new LoggerConstructor();
export { logger };
