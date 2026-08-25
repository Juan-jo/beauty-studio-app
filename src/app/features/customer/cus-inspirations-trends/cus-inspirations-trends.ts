import { Component, computed, inject, Injectable, OnInit, signal } from '@angular/core';
import { Observable, of, delay } from 'rxjs';
import { Location} from '@angular/common';

@Component({
  selector: 'app-cus-inspirations-trends',
  imports: [],
  templateUrl: './cus-inspirations-trends.html',
  styleUrl: './cus-inspirations-trends.css',
})
export class CusInspirationsTrends implements OnInit {

  private designService = inject(DesignService);
  private location = inject(Location);

  // Estados
  isLoading = signal<boolean>(true);
  allDesigns = signal<Design[]>([]);
  selectedCategory = signal<string>('all');
  currentPage = signal<number>(1);
  pageSize = 50;

  // Filtrado computado
  filteredDesigns = computed(() => {
    const category = this.selectedCategory();
    if (category === 'all') return this.allDesigns();
    return this.allDesigns().filter(d => d.category === category);
  });

  // Paginación computada
  totalPages = computed(() => Math.ceil(this.filteredDesigns().length / this.pageSize) || 1);
  
  paginatedDesigns = computed(() => {
    const start = (this.currentPage() - 1) * this.pageSize;
    return this.filteredDesigns().slice(start, start + this.pageSize);
  });

  ngOnInit() {
    this.loadDesigns();
  }

  loadDesigns() {
    this.isLoading.set(true);
    this.designService.getDesigns().subscribe({
      next: (data) => {
        this.allDesigns.set(data);
        this.isLoading.set(false);
      }
    });
  }

  setCategory(category: string) {
    this.selectedCategory.set(category);
    this.currentPage.set(1); // Reiniciar a la primera página
  }

  nextPage() {
    if (this.currentPage() < this.totalPages()) {
      this.currentPage.update(p => p + 1);
    }
  }

  prevPage() {
    if (this.currentPage() > 1) {
      this.currentPage.update(p => p - 1);
    }
  }

  goBack() {
    this.location.back();
  }

}


export interface Design {
  id: string;
  title: string;
  category: 'nails' | 'hair' | 'spa';
  imageUrl: string;
}

@Injectable({
  providedIn: 'root'
})
export class DesignService {
  private mockDesigns: Design[] = [
    // ==========================================
    // --- UÑAS & NAIL ART (20 Diseños) ---
    // ==========================================
    { id: 'n1', title: 'Chrome Effect', category: 'nails', imageUrl: 'https://images.unsplash.com/photo-1604654894610-df63bc536371?auto=format&fit=crop&q=80&w=400' },
    { id: 'n2', title: '3D Pearls Art', category: 'nails', imageUrl: 'https://images.unsplash.com/photo-1632345031435-8727f6897d53?auto=format&fit=crop&q=80&w=400' },
    { id: 'n3', title: 'French Glazed', category: 'nails', imageUrl: 'https://images.unsplash.com/photo-1519014816548-bf5fe059798b?auto=format&fit=crop&q=80&w=400' },
    { id: 'n4', title: 'Minimalist Lines', category: 'nails', imageUrl: 'https://images.unsplash.com/photo-1607779097040-26e80aa78e66?auto=format&fit=crop&q=80&w=400' },
    { id: 'n5', title: 'Velvet Cat Eye', category: 'nails', imageUrl: 'https://images.unsplash.com/photo-1599940824399-b87987ceb72a?auto=format&fit=crop&q=80&w=400' },
    { id: 'n6', title: 'Abstract Gold Leaf', category: 'nails', imageUrl: 'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?auto=format&fit=crop&q=80&w=400' },
    { id: 'n7', title: 'Pastel Gradient', category: 'nails', imageUrl: 'https://images.unsplash.com/photo-1516975080664-ed2fc6a32937?auto=format&fit=crop&q=80&w=400' },
    { id: 'n8', title: 'Matte Floral Art', category: 'nails', imageUrl: 'https://images.unsplash.com/photo-1604654894611-6973b376cbde?auto=format&fit=crop&q=80&w=400' },
    { id: 'n9', title: 'Neon Swirls', category: 'nails', imageUrl: 'https://images.unsplash.com/photo-1610992015732-2449b76344bc?auto=format&fit=crop&q=80&w=400' },
    { id: 'n10', title: 'Milky White Ombré', category: 'nails', imageUrl: 'https://images.unsplash.com/photo-1509967419530-da38b4704bc6?auto=format&fit=crop&q=80&w=400' },
    { id: 'n11', title: 'Rose Gold Foil', category: 'nails', imageUrl: 'https://images.unsplash.com/photo-1522337660859-02fbefca4702?auto=format&fit=crop&q=80&w=400' },
    { id: 'n12', title: 'Dark Emerald Coffin', category: 'nails', imageUrl: 'https://images.unsplash.com/photo-1604654894610-df63bc536371?auto=format&fit=crop&q=80&w=400' },
    { id: 'n13', title: 'Geometric Minimal', category: 'nails', imageUrl: 'https://images.unsplash.com/photo-1632345031435-8727f6897d53?auto=format&fit=crop&q=80&w=400' },
    { id: 'n14', title: 'Aura Aura Glow', category: 'nails', imageUrl: 'https://images.unsplash.com/photo-1519014816548-bf5fe059798b?auto=format&fit=crop&q=80&w=400' },
    { id: 'n15', title: 'Classic Red Stiletto', category: 'nails', imageUrl: 'https://images.unsplash.com/photo-1607779097040-26e80aa78e66?auto=format&fit=crop&q=80&w=400' },
    { id: 'n16', title: 'Tortoise Shell Effect', category: 'nails', imageUrl: 'https://images.unsplash.com/photo-1599940824399-b87987ceb72a?auto=format&fit=crop&q=80&w=400' },
    { id: 'n17', title: 'Lavender Micro French', category: 'nails', imageUrl: 'https://images.unsplash.com/photo-1516975080664-ed2fc6a32937?auto=format&fit=crop&q=80&w=400' },
    { id: 'n18', title: 'Negative Space Art', category: 'nails', imageUrl: 'https://images.unsplash.com/photo-1604654894611-6973b376cbde?auto=format&fit=crop&q=80&w=400' },
    { id: 'n19', title: 'Holographic Silver', category: 'nails', imageUrl: 'https://images.unsplash.com/photo-1610992015732-2449b76344bc?auto=format&fit=crop&q=80&w=400' },
    { id: 'n20', title: 'Nude Almond Swirls', category: 'nails', imageUrl: 'https://images.unsplash.com/photo-1509967419530-da38b4704bc6?auto=format&fit=crop&q=80&w=400' },

    // ==========================================
    // --- CABELLO & PEINADOS (20 Diseños) ---
    // ==========================================
    { id: 'h1', title: 'Balayage Caramel', category: 'hair', imageUrl: 'https://images.unsplash.com/photo-1560869713-7d0a29430803?auto=format&fit=crop&q=80&w=400' },
    { id: 'h2', title: 'Beach Waves', category: 'hair', imageUrl: 'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?auto=format&fit=crop&q=80&w=400' },
    { id: 'h3', title: 'Sleek Bob Cut', category: 'hair', imageUrl: 'https://images.unsplash.com/photo-1595476108010-b4d1f102b1b1?auto=format&fit=crop&q=80&w=400' },
    { id: 'h4', title: 'Copper Highlights', category: 'hair', imageUrl: 'https://images.unsplash.com/photo-1605497788044-5a32c7078486?auto=format&fit=crop&q=80&w=400' },
    { id: 'h5', title: 'Platinum Pixie Cut', category: 'hair', imageUrl: 'https://images.unsplash.com/photo-1580618672591-eb180b1a973f?auto=format&fit=crop&q=80&w=400' },
    { id: 'h6', title: 'Boho Dutch Braids', category: 'hair', imageUrl: 'https://images.unsplash.com/photo-1519699047748-de8e457a634e?auto=format&fit=crop&q=80&w=400' },
    { id: 'h7', title: 'Curtain Bangs & Layers', category: 'hair', imageUrl: 'https://images.unsplash.com/photo-1562322140-8baeececf3df?auto=format&fit=crop&q=80&w=400' },
    { id: 'h8', title: 'Glossy Silk Press', category: 'hair', imageUrl: 'https://images.unsplash.com/photo-1527799820374-dcf8d9d4a388?auto=format&fit=crop&q=80&w=400' },
    { id: 'h9', title: 'Soft Cinnamon Blond', category: 'hair', imageUrl: 'https://images.unsplash.com/photo-1584297091602-801267b2d5e4?auto=format&fit=crop&q=80&w=400' },
    { id: 'h10', title: 'Textured Shag Cut', category: 'hair', imageUrl: 'https://images.unsplash.com/photo-1595476108010-b4d1f102b1b1?auto=format&fit=crop&q=80&w=400' },
    { id: 'h11', title: 'Deep Chocolate Waves', category: 'hair', imageUrl: 'https://images.unsplash.com/photo-1560869713-7d0a29430803?auto=format&fit=crop&q=80&w=400' },
    { id: 'h12', title: 'Messy High Bun', category: 'hair', imageUrl: 'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?auto=format&fit=crop&q=80&w=400' },
    { id: 'h13', title: 'Money Piece Highlights', category: 'hair', imageUrl: 'https://images.unsplash.com/photo-1605497788044-5a32c7078486?auto=format&fit=crop&q=80&w=400' },
    { id: 'h14', title: 'Pastel Pink Melt', category: 'hair', imageUrl: 'https://images.unsplash.com/photo-1580618672591-eb180b1a973f?auto=format&fit=crop&q=80&w=400' },
    { id: 'h15', title: 'Afro Textured Crown', category: 'hair', imageUrl: 'https://images.unsplash.com/photo-1527799820374-dcf8d9d4a388?auto=format&fit=crop&q=80&w=400' },
    { id: 'h16', title: 'Classic Hollywood Waves', category: 'hair', imageUrl: 'https://images.unsplash.com/photo-1519699047748-de8e457a634e?auto=format&fit=crop&q=80&w=400' },
    { id: 'h17', title: 'Long Layers & Blowout', category: 'hair', imageUrl: 'https://images.unsplash.com/photo-1562322140-8baeececf3df?auto=format&fit=crop&q=80&w=400' },
    { id: 'h18', title: 'Honey Brown Ombré', category: 'hair', imageUrl: 'https://images.unsplash.com/photo-1584297091602-801267b2d5e4?auto=format&fit=crop&q=80&w=400' },
    { id: 'h19', title: 'Sleek Low Ponytail', category: 'hair', imageUrl: 'https://images.unsplash.com/photo-1595476108010-b4d1f102b1b1?auto=format&fit=crop&q=80&w=400' },
    { id: 'h20', title: 'Dimensional Ash Blond', category: 'hair', imageUrl: 'https://images.unsplash.com/photo-1560869713-7d0a29430803?auto=format&fit=crop&q=80&w=400' },

    // ==========================================
    // --- SPA & FACIALES (20 Diseños) ---
    // ==========================================
    { id: 's1', title: 'Glow HydraFacial', category: 'spa', imageUrl: 'https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?auto=format&fit=crop&q=80&w=400' },
    { id: 's2', title: 'Lash Lift & Tint', category: 'spa', imageUrl: 'https://images.unsplash.com/photo-1583001809863-2332df9f5141?auto=format&fit=crop&q=80&w=400' },
    { id: 's3', title: 'Brow Lamination', category: 'spa', imageUrl: 'https://images.unsplash.com/photo-1512290900673-70020a174f82?auto=format&fit=crop&q=80&w=400' },
    { id: 's4', title: 'Relax Aromatherapy', category: 'spa', imageUrl: 'https://images.unsplash.com/photo-1544161515-4ab6ce6db874?auto=format&fit=crop&q=80&w=400' },
    { id: 's5', title: '24K Gold Mask Therapy', category: 'spa', imageUrl: 'https://images.unsplash.com/photo-1512290900673-70020a174f82?auto=format&fit=crop&q=80&w=400' },
    { id: 's6', title: 'Hot Stone Massage', category: 'spa', imageUrl: 'https://images.unsplash.com/photo-1600334129128-685c5582fd35?auto=format&fit=crop&q=80&w=400' },
    { id: 's7', title: 'Detox Clay Treatment', category: 'spa', imageUrl: 'https://images.unsplash.com/photo-1515377905703-c4788e51af15?auto=format&fit=crop&q=80&w=400' },
    { id: 's8', title: 'Dermaplaning Facial', category: 'spa', imageUrl: 'https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?auto=format&fit=crop&q=80&w=400' },
    { id: 's9', title: 'Deep Tissue Relief', category: 'spa', imageUrl: 'https://images.unsplash.com/photo-1544161515-4ab6ce6db874?auto=format&fit=crop&q=80&w=400' },
    { id: 's10', title: 'Microdermabrasion', category: 'spa', imageUrl: 'https://images.unsplash.com/photo-1583001809863-2332df9f5141?auto=format&fit=crop&q=80&w=400' },
    { id: 's11', title: 'LED Light Therapy', category: 'spa', imageUrl: 'https://images.unsplash.com/photo-1515377905703-c4788e51af15?auto=format&fit=crop&q=80&w=400' },
    { id: 's12', title: 'Oxygen Infusion Facial', category: 'spa', imageUrl: 'https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?auto=format&fit=crop&q=80&w=400' },
    { id: 's13', title: 'Volumetric Lash Extensions', category: 'spa', imageUrl: 'https://images.unsplash.com/photo-1583001809863-2332df9f5141?auto=format&fit=crop&q=80&w=400' },
    { id: 's14', title: 'Henna Brow Microshading', category: 'spa', imageUrl: 'https://images.unsplash.com/photo-1512290900673-70020a174f82?auto=format&fit=crop&q=80&w=400' },
    { id: 's15', title: 'Swedish Body Massage', category: 'spa', imageUrl: 'https://images.unsplash.com/photo-1600334129128-685c5582fd35?auto=format&fit=crop&q=80&w=400' },
    { id: 's16', title: 'Anti-Aging Collagen Peel', category: 'spa', imageUrl: 'https://images.unsplash.com/photo-1515377905703-c4788e51af15?auto=format&fit=crop&q=80&w=400' },
    { id: 's17', title: 'Scalp Detox Spa', category: 'spa', imageUrl: 'https://images.unsplash.com/photo-1544161515-4ab6ce6db874?auto=format&fit=crop&q=80&w=400' },
    { id: 's18', title: 'Cryo Facial Glow', category: 'spa', imageUrl: 'https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?auto=format&fit=crop&q=80&w=400' },
    { id: 's19', title: 'Bamboo Body Scrub', category: 'spa', imageUrl: 'https://images.unsplash.com/photo-1600334129128-685c5582fd35?auto=format&fit=crop&q=80&w=400' },
    { id: 's20', title: 'Hydrating Eye Contour', category: 'spa', imageUrl: 'https://images.unsplash.com/photo-1583001809863-2332df9f5141?auto=format&fit=crop&q=80&w=400' }
  ];
  // Simula consulta a API con retardo de 500ms
  getDesigns(): Observable<Design[]> {
    return of(this.mockDesigns).pipe(delay(500));
  }

}