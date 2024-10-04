"use client";

import React from "react";

import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  useDisclosure,
} from "@nextui-org/react";
import { useRouter } from "next/navigation";

export default function ExitButton({
  className,
}: {
  className?: string;
}): React.ReactNode {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const router = useRouter();

  return (
    <div className={className}>
      <Button
        variant="light"
        size="lg"
        className="text-red-500"
        onPress={() => {
          onOpen();
        }}
      >
        Save & Exit
      </Button>
      <Modal size="sm" isOpen={isOpen} onClose={onClose} backdrop="opaque">
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">
                Save and Exit
              </ModalHeader>
              <ModalBody>Are you sure you want to save and exit?</ModalBody>
              <ModalFooter>
                <Button color="default" variant="light" onPress={onClose}>
                  Close
                </Button>
                <Button
                  color="danger"
                  onPress={() => {
                    onClose();
                    router.push("/console");
                  }}
                >
                  Save & Exit
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </div>
  );
}
