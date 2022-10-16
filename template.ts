import type { Optional, PropsFor } from "./types.ts";

export type Template<
	RequiredProps extends Record<string, string>,
	DefaultProps extends Record<string, string> = Record<never, never>,
> = {
	render: (props: Optional<RequiredProps, keyof DefaultProps & keyof RequiredProps>) => string;
	sub: <S2 extends string, ReplacedProp extends keyof RequiredProps>(
		replacedProp: ReplacedProp,
		subtemplate: S2,
	) => Template<Omit<RequiredProps, ReplacedProp> & PropsFor<S2>, DefaultProps>;
	setDefault: <NewDefaultProps extends Partial<RequiredProps>>(
		props: NewDefaultProps,
	) => Template<
        RequiredProps,
		DefaultProps & NewDefaultProps
	>;
	getDefault: () => DefaultProps;
	getTemplate: () => string;
};

export const Template = <
	S1 extends string,
	RequiredProps extends Record<string, string> = PropsFor<S1>,
	DefaultProps extends Record<string, string> = Record<never, never>,
>(
	template: S1,
	defaultProps: DefaultProps,
): Template<RequiredProps, DefaultProps> => {
	return {
		render: (props: Optional<RequiredProps, keyof DefaultProps & keyof RequiredProps>) => {
			return [...Object.entries(defaultProps), ...Object.entries(props)]
				.reduce(
					(prev, [key, val]) =>
						prev.replaceAll(`{{${key}}}`, `${val}`),
					template as string,
				);
		},
		sub: <
			S2 extends string,
			ReplacedProp extends keyof RequiredProps,
		>(replacedProp: ReplacedProp, subtemplate: S2) => {
			type NewRequiredProps =
				& Omit<RequiredProps, ReplacedProp>
				& PropsFor<S2>;
			return Template<string, NewRequiredProps, DefaultProps>(
				template.replaceAll(`{{${String(replacedProp)}}}`, subtemplate),
				defaultProps,
			);
		},
		getDefault: () => ({ ...defaultProps }), // later these will enable us to merge templates together enabling pseudo-monadic behaviour
		getTemplate: () => template,
		setDefault: <NewDefaultProps extends Partial<RequiredProps>>(
			props: NewDefaultProps,
		) => {
			return Template<
				string,
				RequiredProps,
				NewDefaultProps & DefaultProps
			>(template, { ...defaultProps, ...props });
		},
	};
};