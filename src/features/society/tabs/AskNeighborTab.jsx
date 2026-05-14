import React from "react";
import { MessageCircle, Plus } from "lucide-react";
import { T, FONTS } from "../../../theme";
import { Card, SectionHeader } from "../../../components/ui";
import { QUESTIONS_SEED } from "../../../data";
import QACard from "../QACard";

export default function AskNeighborTab() {
  return (
    <div>
      <Card style={{ marginBottom: 14 }}>
        <SectionHeader
          pill="Structured Q&A · not open chat" pillIcon={MessageCircle}
          title="What others asked before moving in"
          subtitle="Questions are predefined and answered by verified residents.
                    Responses are aggregated, summarized, and fed back into the
                    pricing engine's locality sentiment signal."
          right={(
            <button style={{
              padding: "9px 14px", background: T.paper,
              border: `1px solid ${T.divider}`, borderRadius: 10, cursor: "pointer",
              fontFamily: FONTS.sans, fontSize: 12, color: T.ink2,
              display: "inline-flex", gap: 6, alignItems: "center",
            }}>
              <Plus size={13} /> Ask a new structured question
            </button>
          )}
        />
      </Card>
      {QUESTIONS_SEED.map((q, i) => <QACard key={i} q={q} idx={i} />)}
    </div>
  );
}
