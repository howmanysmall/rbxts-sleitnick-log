type ReverseMap<T extends Record<keyof T, keyof any>> = {
	[P in T[keyof T]]: {
		[K in keyof T]: T[K] extends P ? K : never;
	}[keyof T];
};

type LoggingFunction = () => LuaTuple<[message: unknown, customData?: unknown]>;
type LogMessage = string | LoggingFunction | object;

interface Levels {
	readonly Trace: 0;
	readonly Debug: 1;
	readonly Info: 2;
	readonly Warning: 3;
	readonly Error: 4;
	readonly Fatal: 5;
}

interface TimeUnit {
	readonly Milliseconds: 0;
	readonly Seconds: 1;
	readonly Minutes: 2;
	readonly Hours: 3;
	readonly Days: 4;
	readonly Weeks: 5;
	readonly Months: 6;
	readonly Years: 7;
}

type Level = keyof Levels;
type ValidLevel = Levels[Level];
type ValidTimeUnit = TimeUnit[keyof TimeUnit];

export interface LogItem<T = void> {
	/**
	 * Asserts the condition and then logs the following
	 * arguments at the Error level if the condition
	 * fails.
	 * @param condition The condition you are checking.
	 * @param message The message to assert with.
	 * @param customData The extra data.
	 */
	Assert<Condition>(condition: Condition, message: LogMessage, customData?: unknown): asserts condition;

	/**
	 * Log only once every `time` `TimeUnit`.
	 * @param time The amount of time to wait before logging again.
	 * @param timeUnit The TimeUnit to use.
	 */
	AtMostEvery(time: number, timeUnit: ValidTimeUnit): LogItem<T>;

	/**
	 * Log only every `times` times.
	 * @param times How often to log.
	 */
	Every(times: number): LogItem<T>;

	/**
	 * Log the message.
	 * @param message The message to log.
	 * @param customData The extra data to log with.
	 */
	Log(message: LogMessage, customData?: unknown): T;

	/**
	 * Make the log throw an error.
	 */
	Throw(): LogItem<never>;

	/**
	 * Returns a function that can be called which will log out the given arguments
	 */
	Wrap(): (message: LogMessage, customData?: unknown) => T;
}

export interface LogClass {
	/**
	 * Literally equivalent to `Log.AtDebug().Wrap()`.
	 * @param message
	 * @param customData
	 */
	Debug: (message: LogMessage, customData?: unknown) => void;

	/**
	 * Literally equivalent to `Log.AtError().Wrap()`.
	 * @param message
	 * @param customData
	 */
	Error: (message: LogMessage, customData?: unknown) => void;

	/**
	 * Literally equivalent to `Log.AtFatal().Wrap()`.
	 * @param message
	 * @param customData
	 */
	Fatal: (message: LogMessage, customData?: unknown) => void;

	/**
	 * Literally equivalent to `Log.AtInfo().Wrap()`.
	 * @param message
	 * @param customData
	 */
	Info: (message: LogMessage, customData?: unknown) => void;

	/**
	 * Literally equivalent to `Log.AtTrace().Wrap()`.
	 * @param message
	 * @param customData
	 */
	Trace: (message: LogMessage, customData?: unknown) => void;

	/**
	 * Literally equivalent to `Log.AtWarning().Wrap()`.
	 * @param message
	 * @param customData
	 */
	Warning: (message: LogMessage, customData?: unknown) => void;

	/**
	 * Literally equivalent to `Log.AtError().Throw().Wrap()`.
	 * @param message
	 * @param customData
	 */
	ErrorThrow: (message: LogMessage, customData?: unknown) => never;

	/**
	 * Literally equivalent to `Log.AtFatal().Throw().Wrap()`.
	 * @param message
	 * @param customData
	 */
	FatalThrow: (message: LogMessage, customData?: unknown) => never;

	/**
	 * Asserts the condition and then logs the following
	 * arguments at the Error level if the condition
	 * fails.
	 * @param condition The condition you are checking.
	 * @param message The message to assert with.
	 * @param customData The extra data.
	 */
	Assert<T>(condition: T, message: LogMessage, customData?: unknown): asserts condition;

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
	 * Sets whether or not this specific logger uses info logs.
	 * @param useInfoLog
	 */
	SetInfoLog(useInfoLog: boolean): LogItem;

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
	readonly Level: Levels;

	/**
	 * An inverse of the Level enum.
	 * @readonly
	 */
	readonly LevelNames: ReverseMap<Levels>;

	/**
	 * The TimeUnit enum.
	 * @readonly
	 */
	readonly TimeUnit: TimeUnit;

	/**
	 * Construct a new Log object. This should only be called once per script!
	 * @param useInfoLog Whether or not to use the info log.
	 */
	new (useInfoLog?: boolean): LogClass;

	/**
	 * Create a new Log object with the given script name. This avoids having to use `debug.info`.
	 * @param scriptName The Script's name.
	 * @param useInfoLog Whether or not to use the info log.
	 */
	readonly ForName: (scriptName: string, useInfoLog?: boolean) => LogClass;

	/**
	 * Globally sets if the info log is enabled.
	 * @param enabled Whether or not the info log is enabled.
	 */
	readonly SetInfoLogEnabled: (enabled: boolean) => void;
}

interface LogConfigEntry {
	readonly GameId?: number;
	readonly GameIds?: Array<number>;

	readonly PlaceId?: number;
	readonly PlaceIds?: Array<number>;

	readonly Server: Level;
	readonly Client: Level;
}

export type LogConfig =
	| Level
	| {
			readonly Default?: Level | LogConfigEntry;
			readonly Studio?: Level | LogConfigEntry;
			readonly [key: string]: Level | LogConfigEntry | undefined;
	  };

/** @deprecated */
export type ILogConfig = LogConfig;

declare const Log: Log;

export { Log };
export default Log;
