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
    <aside className="w-full h-[100dvh] md:h-auto bg-primary border-r border-border flex flex-col">
      <div className="flex-1 overflow-y-auto">  
      {variant === "conversation" ? (
        <ConversationsAsideSection />
      ) : (
        <ContactsAsideSection />
      )}
      </div>
    </aside>
  );
};

export default Aside