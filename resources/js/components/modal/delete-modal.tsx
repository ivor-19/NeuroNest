import { toast } from "sonner";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "../ui/alert-dialog";
import { router } from "@inertiajs/react";

interface DeleteModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  id: number
  routeLink: string
}

export default function DeleteModal ({ open, onOpenChange, id, routeLink} : DeleteModalProps) {
  return(
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
          <AlertDialogDescription>
            This action cannot be undone. This will permanently delete the assessment and remove all associated data.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction
            className="bg-red-600 hover:bg-red-700"
            onClick={() => {
             
              console.log("Deleting assessment:", id);
              router.delete(route(`${routeLink}`, id), {
                preserveScroll: true,
                onSuccess: () => {
                  router.reload();
                },
              })
              toast('Delete successfully')
              onOpenChange(false);
              
            }}
          >
            Delete Assessment
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}