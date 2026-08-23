import type { Module } from './types';
import m1 from './modules/m1';
import m2 from './modules/m2';
import m3 from './modules/m3';
import m4 from './modules/m4';
import m5 from './modules/m5';
import m6 from './modules/m6';
import m7 from './modules/m7';
import m8 from './modules/m8';

export const ALL_MODULES: Module[] = [m1, m2, m3, m4, m5, m6, m7, m8];

export function findModule(moduleId: string): Module | undefined {
  return ALL_MODULES.find((m) => m.id === moduleId);
}

export function findLesson(moduleId: string, lessonId: string) {
  const module = findModule(moduleId);
  const lesson = module?.lessons.find((l) => l.id === lessonId);
  return module && lesson ? { module, lesson } : undefined;
}

export const TOTAL_LESSONS = () => ALL_MODULES.reduce((s, m) => s + m.lessons.length, 0);
