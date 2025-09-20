import EventEmitter from "events";
export const emitter = new EventEmitter()
export default async function ConfirmDialog({
    title = '',
    message = ''
}: {
    title: string,
    message: string,
}) {
    emitter.emit('confirm-dialog-title', title)
    emitter.emit('confirm-dialog-message', message)
    emitter.emit('confirm-dialog-show', true)
    emitter.addListener('confirm-dialog-show', () => {
    })
    return new Promise((resolve: (e: any) => void, reject: () => void) => {
        emitter.addListener('confirm-dialog-confirmed', (_isConfirmed: boolean) => {
            emitter.emit('confirm-dialog-show', false)
            resolve(_isConfirmed);
        })
    })
}