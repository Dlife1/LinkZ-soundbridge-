import React from 'react';

export type ViewState = 'dashboard' | 'distribution' | 'ai' | 'analytics' | 'create-release' | 'library';

export interface NavItem {
  id: ViewState;
  label: string;
  icon: React.ElementType;
}

export interface TrackData {
  id: string;
  title: string;
  status: 'active' | 'syncing' | 'error';
  node: string;
  territories: string;
}

export interface LogEntry {
  id: number;
  message: string;
  type: 'info' | 'success' | 'warning' | 'error' | 'command';
  timestamp: string;
}

export interface ServiceStatus {
  name: string;
  status: 'offline' | 'pending' | 'running' | 'error';
  port: string;
  latency: string;
}

// DDEX 4.3 simplified structure
export interface ReleaseMetadata {
  id: string;
  title: string;
  displayArtist: string;
  version?: string;
  type: 'Album' | 'Single' | 'EP';
  primaryGenre: string;
  secondaryGenre?: string;
  releaseDate: string;
  labelName: string;
  cLine: string; // ©
  pLine: string; // ℗
  upc: string;
  grid: string; // Global Release Identifier
  explicit: boolean;
  language: string;
  status: 'draft' | 'ai-review' | 'ready' | 'distributed' | 'takedown';
  coverArtUrl?: string;
  aiAnalysis?: string;
}