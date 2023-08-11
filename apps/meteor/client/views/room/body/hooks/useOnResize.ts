import { useMutableCallback } from '@rocket.chat/fuselage-hooks';
import { useCallback, useEffect, useState } from 'react';

export const useOnResize = (cb: () => void) => {
	const fn = useMutableCallback(() => {
		cb();
	});

	const [observer] = useState(() => new ResizeObserver(fn));

	useEffect(() => () => observer.disconnect(), [observer]);

	const callbackRef = useCallback(
		(node: HTMLElement | null) => {
			if (!node) {
				return;
			}

			observer.observe(node);
		},
		[observer],
	);

	return callbackRef;
};
