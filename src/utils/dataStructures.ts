// Data Structures for Smart Insights

// Custom HashMap for categorizing expenses
export class ExpenseHashMap<K, V> {
  private buckets: Map<K, V[]>;

  constructor() {
    this.buckets = new Map();
  }

  set(key: K, value: V): void {
    if (!this.buckets.has(key)) {
      this.buckets.set(key, []);
    }
    this.buckets.get(key)!.push(value);
  }

  get(key: K): V[] {
    return this.buckets.get(key) || [];
  }

  getAll(): Map<K, V[]> {
    return this.buckets;
  }

  keys(): K[] {
    return Array.from(this.buckets.keys());
  }

  has(key: K): boolean {
    return this.buckets.has(key);
  }

  clear(): void {
    this.buckets.clear();
  }

  getTotalByKey(key: K, getValue: (item: V) => number): number {
    const items = this.get(key);
    return items.reduce((sum, item) => sum + getValue(item), 0);
  }
}

// Max Heap for finding top spending categories
export class MaxHeap<T> {
  private heap: T[];
  private compareFn: (a: T, b: T) => number;

  constructor(compareFn: (a: T, b: T) => number) {
    this.heap = [];
    this.compareFn = compareFn;
  }

  private getParentIndex(index: number): number {
    return Math.floor((index - 1) / 2);
  }

  private getLeftChildIndex(index: number): number {
    return 2 * index + 1;
  }

  private getRightChildIndex(index: number): number {
    return 2 * index + 2;
  }

  private swap(i: number, j: number): void {
    [this.heap[i], this.heap[j]] = [this.heap[j], this.heap[i]];
  }

  private heapifyUp(index: number): void {
    while (index > 0) {
      const parentIndex = this.getParentIndex(index);
      if (this.compareFn(this.heap[index], this.heap[parentIndex]) > 0) {
        this.swap(index, parentIndex);
        index = parentIndex;
      } else {
        break;
      }
    }
  }

  private heapifyDown(index: number): void {
    while (this.getLeftChildIndex(index) < this.heap.length) {
      let largestIndex = index;
      const leftIndex = this.getLeftChildIndex(index);
      const rightIndex = this.getRightChildIndex(index);

      if (leftIndex < this.heap.length && 
          this.compareFn(this.heap[leftIndex], this.heap[largestIndex]) > 0) {
        largestIndex = leftIndex;
      }

      if (rightIndex < this.heap.length && 
          this.compareFn(this.heap[rightIndex], this.heap[largestIndex]) > 0) {
        largestIndex = rightIndex;
      }

      if (largestIndex !== index) {
        this.swap(index, largestIndex);
        index = largestIndex;
      } else {
        break;
      }
    }
  }

  insert(value: T): void {
    this.heap.push(value);
    this.heapifyUp(this.heap.length - 1);
  }

  extractMax(): T | null {
    if (this.heap.length === 0) return null;
    if (this.heap.length === 1) return this.heap.pop()!;

    const max = this.heap[0];
    this.heap[0] = this.heap.pop()!;
    this.heapifyDown(0);
    return max;
  }

  peek(): T | null {
    return this.heap.length > 0 ? this.heap[0] : null;
  }

  getAll(): T[] {
    return [...this.heap];
  }

  size(): number {
    return this.heap.length;
  }

  clear(): void {
    this.heap = [];
  }
}

// Graph for showing spending relationships
export class SpendingGraph {
  private adjacencyList: Map<string, Map<string, number>>;

  constructor() {
    this.adjacencyList = new Map();
  }

  addVertex(vertex: string): void {
    if (!this.adjacencyList.has(vertex)) {
      this.adjacencyList.set(vertex, new Map());
    }
  }

  addEdge(from: string, to: string, weight: number): void {
    this.addVertex(from);
    this.addVertex(to);
    
    const currentWeight = this.adjacencyList.get(from)!.get(to) || 0;
    this.adjacencyList.get(from)!.set(to, currentWeight + weight);
  }

  getConnections(vertex: string): Map<string, number> {
    return this.adjacencyList.get(vertex) || new Map();
  }

  getAllVertices(): string[] {
    return Array.from(this.adjacencyList.keys());
  }

  getStrongestConnections(limit: number = 5): Array<{ from: string; to: string; weight: number }> {
    const connections: Array<{ from: string; to: string; weight: number }> = [];
    
    this.adjacencyList.forEach((edges, from) => {
      edges.forEach((weight, to) => {
        connections.push({ from, to, weight });
      });
    });

    return connections
      .sort((a, b) => b.weight - a.weight)
      .slice(0, limit);
  }

  getRelatedCategories(category: string): Array<{ category: string; correlation: number }> {
    const connections = this.getConnections(category);
    const result: Array<{ category: string; correlation: number }> = [];

    connections.forEach((weight, cat) => {
      result.push({ category: cat, correlation: weight });
    });

    return result.sort((a, b) => b.correlation - a.correlation);
  }

  clear(): void {
    this.adjacencyList.clear();
  }
}
