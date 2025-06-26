import { toast } from "sonner";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "../ui/alert-dialog";
import { router } from "@inertiajs/react";

interface DeleteModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  id: number
  routeLink: string
  description: string
  toastMessage: string
  buttonTitle: string
}

export default function DeleteModal ({ open, onOpenChange, id, routeLink, description, toastMessage, buttonTitle} : DeleteModalProps) {
  return(
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
          <AlertDialogDescription>
            This action cannot be undone. {description}.
          </AlertDialogDescription>
          {/* This will permanently delete the assessment and remove all associated data */}
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction
            className="bg-red-600 hover:bg-red-700"
            onClick={() => {
             
              console.log("Deleting :", id);
              router.delete(route(`${routeLink}`, id), {
                preserveScroll: true,
                onSuccess: () => {
                  router.reload();
                  window.location.reload();
                },
              })
              toast(toastMessage)
              onOpenChange(false);
              
            }}
          >
            {buttonTitle}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}