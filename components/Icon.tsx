
import React from 'react';
import { 
  // Existing
  Search, Plus, Settings, Bot, ExternalLink, Trash2, Edit2, X, MessageSquare, Send,
  Loader2, Github, Grid, Command, Sparkles, Check, Save, RotateCcw, FileJson,
  Download, Code, Palette, Zap, Globe, Layout, Terminal, Hash,
  ChevronDown, ChevronUp, ChevronLeft, ChevronRight, Copy, Edit3, Maximize2, Minimize2,
  
  // New Additions
  Home, Link, Link2, Menu, List, MoreHorizontal, ArrowRight, ArrowUpRight,
  Cpu, Database, Server, Cloud, Laptop, Smartphone, Monitor, Wifi, Bluetooth, 
  HardDrive, Keyboard, Mouse, Printer,
  Image, Video, Music, Mic, Headphones, Camera, Play, Pause, Volume2, Film, Radio,
  Mail, Calendar, Clock, FileText, Folder, FolderOpen, Archive, Briefcase, Paperclip, Calculator,
  PenTool, Layers, Crop, Move, Type, Droplet,
  Twitter, Facebook, Instagram, Linkedin, Youtube, Twitch, MessageCircle, Share2,
  Wrench, Hammer, Pen, Key, Lock, Shield, Eye,
  Heart, Star, Sun, Moon, User, Users, ShoppingCart, CreditCard, MapPin, Coffee, 
  Gift, Flag, Bookmark, Book, Gamepad, Gamepad2, Rocket, Anchor, Truck, Plane,
  Wallet, PieChart, BarChart, Activity, Bell, Battery, Cast, Upload, AlertTriangle, UploadCloud
} from 'lucide-react';

export const Icons = {
  // Core UI
  Search, Plus, Settings, Bot, ExternalLink, Trash2, Edit2, Edit3, Copy, X, MessageSquare, Send,
  Loader2, Github, Grid, Command, Sparkles, Check, Save, RotateCcw, FileJson,
  Download, Upload, UploadCloud, Menu, List, MoreHorizontal, ArrowRight, ArrowUpRight, AlertTriangle,
  ChevronDown, ChevronUp, ChevronLeft, ChevronRight, Maximize2, Minimize2,
  
  // Categories - Tech
  Code, Terminal, Hash, Cpu, Database, Server, Cloud, Laptop, Smartphone, 
  Monitor, Wifi, Bluetooth, HardDrive, Keyboard, Mouse, Printer, Battery, Cast,

  // Categories - Design & Media
  Palette, Layout, Image, Video, Music, Mic, Headphones, Camera, Play, Pause, 
  Volume2, Film, Radio, PenTool, Layers, Crop, Move, Type, Droplet,

  // Categories - Office & Productivity
  Zap, Globe, Mail, Calendar, Clock, FileText, Folder, FolderOpen, Archive, 
  Briefcase, Paperclip, Calculator, PieChart, BarChart, Activity, Bell,

  // Categories - Social
  Twitter, Facebook, Instagram, Linkedin, Youtube, Twitch, MessageCircle, Share2,

  // Categories - Tools & Security
  Wrench, Hammer, Pen, Key, Lock, Shield, Eye,

  // Categories - Lifestyle & Misc
  Home, Link, Link2, Heart, Star, Sun, Moon, User, Users, ShoppingCart, 
  CreditCard, MapPin, Coffee, Gift, Flag, Bookmark, Book, Gamepad, Gamepad2, 
  Rocket, Anchor, Truck, Plane, Wallet
};

interface IconProps {
  name: keyof typeof Icons | string;
  size?: number;
  className?: string;
}

const Icon: React.FC<IconProps> = ({ name, size = 20, className }) => {
  // @ts-ignore
  const LucideIcon = Icons[name];
  
  // Fallback if icon name doesn't exist (e.g. if loaded from old config)
  if (!LucideIcon) return <Icons.Hash size={size} className={className} />;
  
  return <LucideIcon size={size} className={className} />;
};

export default Icon;
