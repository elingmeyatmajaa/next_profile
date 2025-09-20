import EventEmitter from "events"
import { useEffect, useState } from "react"
import { emitter } from "./confirm-dialog";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTrigger } from "../ui/alert-dialog";
import { AlertDialogTitle } from "@radix-ui/react-alert-dialog";
import __ from "@/lib/lang";

export default function DialogContainer() {
    const [open, setOpen] = useState(false)
    const [title, setTitle] = useState('')
    const [message, setMessage] = useState('')


    useEffect(() => {
        emitter.on('confirm-dialog-show', (_open: boolean) => {
            setOpen(_open)
        })
        emitter.on('confirm-dialog-title', (_title: string) => {
            setTitle(_title)
        })
        emitter.on('confirm-dialog-message', (_message: string) => {
            setMessage(_message)
        })
    }, [])
    return (
        <>
            <AlertDialog
                open={open}
            >
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>{title}</AlertDialogTitle>
                        <AlertDialogDescription>
                            {message}
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel
                            onClick={() => setOpen(false)}
                        >{__('No')}
                        </AlertDialogCancel>
                        <AlertDialogAction
                            onClick={() => {
                                emitter.emit('confirm-dialog-confirmed', true)
                            }}
                        >
                            {__('Yes')}
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </>
    )
}