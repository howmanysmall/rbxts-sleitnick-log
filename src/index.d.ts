type ReverseMap<T extends Record<keyof T, keyof any>> = {
	[P in T[keyof T]]: {
		[K in keyof T]: T[K] extends P ? K : never;
	}[keyof T];
};

type LoggingFunction = () => LuaTuple<[message: unknown, customData?: unknown]>;
type LogMessage = string | LoggingFunction | object;

interface Levels {
	Trace: 0;
	Debug: 1;
	Info: 2;
	Warning: 3;
	Error: 4;
	Fatal: 5;
}

interface TimeUnit {
	Milliseconds: 0;
	Seconds: 1;
	Minutes: 2;
	Hours: 3;
	Days: 4;
	Weeks: 5;
	Months: 6;
	Years: 7;
}

type Level = keyof Levels;
type ValidLevel = Levels[Level];
type ValidTimeUnit = TimeUnit[keyof TimeUnit];

export interface LogItem {
	/**
	 * Asserts the condition and then logs the following
	 * arguments at the Error level if the condition
	 * fails.
	 * @param condition The condition you are checking.
	 * @param message The message to assert with.
	 * @param customData The extra data.
	 */
	Assert<T>(condition: T, message: LogMessage, customData?: object): asserts condition;

	/**
	 * Log only once every `time` `TimeUnit`.
	 * @param time The amount of time to wait before logging again.
	 * @param timeUnit The TimeUnit to use.
	 */
	AtMostEvery(time: number, timeUnit: ValidTimeUnit): LogItem;

	/**
	 * Log only every `times` times.
	 * @param times How often to log.
	 */
	Every(times: number): LogItem;

	/**
	 * Log the message.
	 * @param message The message to log.
	 * @param customData The extra data to log with.
	 */
	Log(message: LogMessage, customData?: object): void;

	/**
	 * Make the log throw an error.
	 */
	Throw(): LogItem;

	/**
	 * Returns a function that can be called which will log out the given arguments
	 */
	Wrap(): (message: LogMessage, customData?: object) => void;
}

interface LogClass {
	/**
	 * Asserts the condition and then logs the following
	 * arguments at the Error level if the condition
	 * fails.
	 * @param condition The condition you are checking.
	 * @param message The message to assert with.
	 * @param customData The extra data.
	 */
	Assert<T>(condition: T, message: LogMessage, customData?: object): asserts condition;

	/**
	 * Creates a LogItem at the given level.
	 * @param level The level to log at.
	 */
	At(level: ValidLevel): LogItem;

	/**
	 * Get a LogItem at the `Debug` log level.
	 */
	AtDebug(): LogItem;

	/**
	 * Get a LogItem at the `Error` log level.
	 */
	AtError(): LogItem;

	/**
	 * Get a LogItem at the `Fatal` log level.
	 */
	AtFatal(): LogItem;

	/**
	 * Get a LogItem at the `Info` log level.
	 */
	AtInfo(): LogItem;

	/**
	 * Get a LogItem at the `Trace` log level.
	 */
	AtTrace(): LogItem;

	/**
	 * Get a LogItem at the `Warning` log level.
	 */
	AtWarning(): LogItem;

	/**
	 * This doesn't really do anything.
	 */
	Destroy(): void;
}

interface Log {
	/**
	 * The Level enum.
	 * @readonly
	 */
	Level: Levels;

	/**
	 * An inverse of the Level enum.
	 * @readonly
	 */
	LevelNames: ReverseMap<Levels>;

	/**
	 * The TimeUnit enum.
	 * @readonly
	 */
	TimeUnit: TimeUnit;

	/**
	 * Construct a new Log object. This should only be called once per script!
	 */
	new (): LogClass;

	SetInfoLogEnabled(this: void, enabled: boolean): void;
}

interface ILogConfigEntry {
	GameId?: number;
	GameIds?: Array<number>;

	PlaceId?: number;
	PlaceIds?: Array<number>;

	Server: Level;
	Client: Level;
}

export type ILogConfig =
	| Level
	| {
			Default?: Level | ILogConfigEntry;
			Studio?: Level | ILogConfigEntry;
			[key: string]: Level | ILogConfigEntry | undefined;
	  };

declare const Log: Log;

export { Log };
export default Log;
