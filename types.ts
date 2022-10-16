export type PropsFor<Text extends string, Props extends string[] = []> =
	Text extends `${string}{{${infer Prop}}}${infer Remainder}`
		? PropsFor<Remainder, [...Props, Prop]>
		: Record<Props[number], string>;
        
export type Optional<T, K extends keyof T> = Pick<Partial<T>, K> & Omit<T, K>;
