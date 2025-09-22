import { Button } from "@/components/ui/button"
import { useDialog } from "./use-dialog"

export function useConfirmDialog() {
  const { showDialog, hideDialog } = useDialog()

  const confirm = (options: {
    title?: string
    description?: string
    confirmText?: string
    cancelText?: string
  }) => {
    return new Promise<boolean>((resolve) => {
      const handleConfirm = () => {
        hideDialog()
        resolve(true)
      }

      const handleCancel = () => {
        hideDialog()
        resolve(false)
      }

      showDialog({
        title: options.title,
        description: options.description,
        content: (
          <></>
        ),
        actions : (

          <div className="p-4">
            <Button
              onClick={handleCancel}
              variant={"ghost"}
            >
              {options.cancelText ?? "Cancel"}
            </Button>
            <Button
              onClick={handleConfirm}
            >
              {options.confirmText ?? "OK"}
            </Button>
          </div>
        ),
        size: "sm",
      })
    })
  }

  return { confirm }
}
