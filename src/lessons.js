import { lessonsT1 } from "./lessons-t1.js";
import { lessonsT2 } from "./lessons-t2.js";

const lessons = { ...lessonsT1, ...lessonsT2 };

export function chapterLesson(id) {
  return lessons[id] || null;
}
