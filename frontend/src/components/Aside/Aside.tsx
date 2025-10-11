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
    <aside className="w-[25%] h-full bg-primary border-r border-border">
      {variant === "conversation" ? (
        <ConversationsAsideSection />
      ) : (
        <ContactsAsideSection />
      )}
    </aside>
  );
};

export default Aside