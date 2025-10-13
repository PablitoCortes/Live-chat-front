"use client";
import React from "react";
import { AsideVariant } from "./Aside.types";
import ConversationsAsideSection from "./ConversationVariant";
import ContactsAsideSection from "./ContactVariant";

type AsideProps = {
  variant: AsideVariant;
};

const Aside: React.FC<AsideProps> = ({ variant }) => {
  return (
    <aside className="w-full h-full bg-primary border-r border-border flex flex-col">
      {variant === "conversation" ? (
        <ConversationsAsideSection />
      ) : (
        <ContactsAsideSection />
      )}
    </aside>
  );
};

export default Aside