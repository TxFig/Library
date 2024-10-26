import type { RequestEvent, MaybePromise } from "@sveltejs/kit"


export type TargetFunction<Event extends RequestEvent, Return> = (event: Event) => MaybePromise<Return>
export type Decorator<Event extends RequestEvent, Return> = (target: TargetFunction<Event, Return>) => TargetFunction<Event, Return>

export function applyDecorators<Event extends RequestEvent, Return>(
    decorators: Decorator<Event, Return>[],
    target: TargetFunction<Event, Return>
): typeof target {
    return decorators.reduceRight(
        (decorated, decorator) => decorator(decorated),
        target
    )
}
