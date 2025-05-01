"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function MotivationalPhrases({
  newPhrase,
  setNewPhrase,
  favoriteMotivationalPhrases,
  addMotivationalPhrase,
  removeMotivationalPhrase,
  predefinedPhrases,
  addPredefinedPhrase,
}) {
  return (
    <div className="space-y-2">
      <Label>Frases motivacionales</Label>
      <div className="space-y-2">
        {favoriteMotivationalPhrases.map((phrase, index) => (
          <div key={index} className="flex items-center justify-between">
            <span>{phrase}</span>
            <Button variant="ghost" onClick={() => removeMotivationalPhrase(phrase)}>X</Button>
          </div>
        ))}
      </div>
      <div className="flex space-x-2">
        <Input
          type="text"
          placeholder="Añadir tu frase..."
          value={newPhrase}
          onChange={(e) => setNewPhrase(e.target.value)}
        />
        <Button onClick={addMotivationalPhrase}>Añadir</Button>
      </div>
      <div className="mt-2">
        <Label>Frases predefinidas</Label>
        <div className="flex flex-wrap gap-2">
          {predefinedPhrases.map((phrase, index) => (
            <Button key={index} variant="outline" size="sm" onClick={() => addPredefinedPhrase(phrase)}>
              {phrase}
            </Button>
          ))}
        </div>
      </div>
    </div>
  );
}
