'use client';

/**
 * Menu Builder Page
 * صفحة بناء القوائم
 */

import React, { useState } from 'react';
import { useLocale } from 'next-intl';
import {
  Save,
  Plus,
  Trash2,
  GripVertical,
  ChevronDown,
  ChevronRight,
  ExternalLink,
  Link as LinkIcon,
  Eye,
  EyeOff,
  Menu as MenuIcon,
  LayoutGrid,
  Smartphone,
  Monitor,
} from 'lucide-react';

// Menu item type
interface MenuItem {
  id: string;
  label: { ar: string; en: string };
  url: string;
  type: 'internal' | 'external';
  target: '_self' | '_blank';
  icon?: string;
  order: number;
  isActive: boolean;
  children?: MenuItem[];
}

// Menu type
interface Menu {
  id: string;
  name: string;
  nameAr: string;
  location: 'header' | 'footer' | 'sidebar' | 'mobile';
  items: MenuItem[];
  isActive: boolean;
}

// Mock menu data
const mockMenus: Menu[] = [
  {
    id: '1',
    name: 'Main Navigation',
    nameAr: 'القائمة الرئيسية',
    location: 'header',
    isActive: true,
    items: [
      {
        id: '1-1',
        label: { ar: 'الرئيسية', en: 'Home' },
        url: '/',
        type: 'internal',
        target: '_self',
        order: 1,
        isActive: true,
      },
      {
        id: '1-2',
        label: { ar: 'من نحن', en: 'About' },
        url: '/about',
        type: 'internal',
        target: '_self',
        order: 2,
        isActive: true,
      },
      {
        id: '1-3',
        label: { ar: 'خدماتنا', en: 'Services' },
        url: '/services',
        type: 'internal',
        target: '_self',
        order: 3,
        isActive: true,
        children: [
          {
            id: '1-3-1',
            label: { ar: 'تطوير الويب', en: 'Web Development' },
            url: '/services/web',
            type: 'internal',
            target: '_self',
            order: 1,
            isActive: true,
          },
          {
            id: '1-3-2',
            label: { ar: 'تطبيقات الموبايل', en: 'Mobile Apps' },
            url: '/services/mobile',
            type: 'internal',
            target: '_self',
            order: 2,
            isActive: true,
          },
        ],
      },
      {
        id: '1-4',
        label: { ar: 'أعمالنا', en: 'Portfolio' },
        url: '/portfolio',
        type: 'internal',
        target: '_self',
        order: 4,
        isActive: true,
      },
      {
        id: '1-5',
        label: { ar: 'فريقنا', en: 'Team' },
        url: '/team',
        type: 'internal',
        target: '_self',
        order: 5,
        isActive: true,
      },
      {
        id: '1-6',
        label: { ar: 'تواصل معنا', en: 'Contact' },
        url: '/contact',
        type: 'internal',
        target: '_self',
        order: 6,
        isActive: true,
      },
    ],
  },
  {
    id: '2',
    name: 'Footer Links',
    nameAr: 'روابط التذييل',
    location: 'footer',
    isActive: true,
    items: [
      {
        id: '2-1',
        label: { ar: 'سياسة الخصوصية', en: 'Privacy Policy' },
        url: '/privacy',
        type: 'internal',
        target: '_self',
        order: 1,
        isActive: true,
      },
      {
        id: '2-2',
        label: { ar: 'الشروط والأحكام', en: 'Terms & Conditions' },
        url: '/terms',
        type: 'internal',
        target: '_self',
        order: 2,
        isActive: true,
      },
      {
        id: '2-3',
        label: { ar: 'تويتر', en: 'Twitter' },
        url: 'https://twitter.com/mwm',
        type: 'external',
        target: '_blank',
        order: 3,
        isActive: true,
      },
    ],
  },
  {
    id: '3',
    name: 'Mobile Menu',
    nameAr: 'قائمة الموبايل',
    location: 'mobile',
    isActive: true,
    items: [
      {
        id: '3-1',
        label: { ar: 'الرئيسية', en: 'Home' },
        url: '/',
        type: 'internal',
        target: '_self',
        order: 1,
        isActive: true,
      },
      {
        id: '3-2',
        label: { ar: 'خدماتنا', en: 'Services' },
        url: '/services',
        type: 'internal',
        target: '_self',
        order: 2,
        isActive: true,
      },
      {
        id: '3-3',
        label: { ar: 'تواصل معنا', en: 'Contact' },
        url: '/contact',
        type: 'internal',
        target: '_self',
        order: 3,
        isActive: true,
      },
    ],
  },
];

// Location icons
const locationIcons = {
  header: Monitor,
  footer: LayoutGrid,
  sidebar: MenuIcon,
  mobile: Smartphone,
};

export default function MenusPage() {
  const locale = useLocale();
  const isArabic = locale === 'ar';

  const [menus, setMenus] = useState<Menu[]>(mockMenus);
  const [selectedMenu, setSelectedMenu] = useState<string | null>(mockMenus[0]?.id || null);
  const [_editingItem, _setEditingItem] = useState<string | null>(null);
  const [showAddMenu, setShowAddMenu] = useState(false);
  const [showAddItem, setShowAddItem] = useState(false);
  const [expandedItems, setExpandedItems] = useState<Set<string>>(new Set());
  const [hasChanges, setHasChanges] = useState(false);
  const [previewMode, setPreviewMode] = useState(false);

  // New menu form
  const [newMenu, setNewMenu] = useState({
    name: '',
    nameAr: '',
    location: 'header' as Menu['location'],
  });

  // New item form
  const [newItem, setNewItem] = useState({
    labelAr: '',
    labelEn: '',
    url: '',
    type: 'internal' as 'internal' | 'external',
    target: '_self' as '_self' | '_blank',
    parentId: null as string | null,
  });

  // Get current menu
  const currentMenu = menus.find(m => m.id === selectedMenu);

  // Toggle item expansion
  const toggleItemExpansion = (itemId: string) => {
    const newExpanded = new Set(expandedItems);
    if (newExpanded.has(itemId)) {
      newExpanded.delete(itemId);
    } else {
      newExpanded.add(itemId);
    }
    setExpandedItems(newExpanded);
  };

  // Add new menu
  const addMenu = () => {
    if (!newMenu.name || !newMenu.nameAr) return;

    const menu: Menu = {
      id: Date.now().toString(),
      name: newMenu.name,
      nameAr: newMenu.nameAr,
      location: newMenu.location,
      isActive: true,
      items: [],
    };

    setMenus(prev => [...prev, menu]);
    setSelectedMenu(menu.id);
    setNewMenu({ name: '', nameAr: '', location: 'header' });
    setShowAddMenu(false);
    setHasChanges(true);
  };

  // Add new item
  const addItem = () => {
    if (!newItem.labelAr || !newItem.labelEn || !newItem.url || !currentMenu) return;

    const item: MenuItem = {
      id: Date.now().toString(),
      label: { ar: newItem.labelAr, en: newItem.labelEn },
      url: newItem.url,
      type: newItem.type,
      target: newItem.target,
      order: currentMenu.items.length + 1,
      isActive: true,
    };

    setMenus(prev =>
      prev.map(menu => {
        if (menu.id !== selectedMenu) return menu;

        if (newItem.parentId) {
          // Add as child
          return {
            ...menu,
            items: menu.items.map(menuItem => {
              if (menuItem.id === newItem.parentId) {
                return {
                  ...menuItem,
                  children: [...(menuItem.children || []), item],
                };
              }
              return menuItem;
            }),
          };
        }

        return { ...menu, items: [...menu.items, item] };
      })
    );

    setNewItem({
      labelAr: '',
      labelEn: '',
      url: '',
      type: 'internal',
      target: '_self',
      parentId: null,
    });
    setShowAddItem(false);
    setHasChanges(true);
  };

  // Delete item
  const deleteItem = (itemId: string, parentId?: string) => {
    if (
      !confirm(
        isArabic ? 'هل أنت متأكد من حذف هذا العنصر؟' : 'Are you sure you want to delete this item?'
      )
    ) {
      return;
    }

    setMenus(prev =>
      prev.map(menu => {
        if (menu.id !== selectedMenu) return menu;

        if (parentId) {
          return {
            ...menu,
            items: menu.items.map(item => {
              if (item.id === parentId) {
                return {
                  ...item,
                  children: item.children?.filter(child => child.id !== itemId),
                };
              }
              return item;
            }),
          };
        }

        return { ...menu, items: menu.items.filter(item => item.id !== itemId) };
      })
    );
    setHasChanges(true);
  };

  // Toggle item active
  const toggleItemActive = (itemId: string, parentId?: string) => {
    setMenus(prev =>
      prev.map(menu => {
        if (menu.id !== selectedMenu) return menu;

        if (parentId) {
          return {
            ...menu,
            items: menu.items.map(item => {
              if (item.id === parentId) {
                return {
                  ...item,
                  children: item.children?.map(child =>
                    child.id === itemId ? { ...child, isActive: !child.isActive } : child
                  ),
                };
              }
              return item;
            }),
          };
        }

        return {
          ...menu,
          items: menu.items.map(item =>
            item.id === itemId ? { ...item, isActive: !item.isActive } : item
          ),
        };
      })
    );
    setHasChanges(true);
  };

  // Move item up
  const moveItemUp = (itemId: string, parentId?: string) => {
    setMenus(prev =>
      prev.map(menu => {
        if (menu.id !== selectedMenu) return menu;

        const items = parentId
          ? menu.items.find(i => i.id === parentId)?.children || []
          : menu.items;

        const index = items.findIndex(i => i.id === itemId);
        if (index <= 0) return menu;

        const newItems = [...items];
        [newItems[index - 1], newItems[index]] = [newItems[index], newItems[index - 1]];
        newItems.forEach((item, i) => (item.order = i + 1));

        if (parentId) {
          return {
            ...menu,
            items: menu.items.map(item =>
              item.id === parentId ? { ...item, children: newItems } : item
            ),
          };
        }

        return { ...menu, items: newItems };
      })
    );
    setHasChanges(true);
  };

  // Save changes
  const saveChanges = () => {
    console.log('Saving menus:', menus);
    setHasChanges(false);
  };

  // Render menu item
  const renderMenuItem = (item: MenuItem, parentId?: string, level = 0) => {
    const hasChildren = item.children && item.children.length > 0;
    const isExpanded = expandedItems.has(item.id);

    return (
      <div key={item.id} className={`${level > 0 ? 'ms-6 border-s-2 ps-4' : ''}`}>
        <div
          className={`flex items-center gap-2 rounded-lg p-3 ${
            !item.isActive ? 'opacity-50' : ''
          } hover:bg-muted/50 group transition-colors`}
        >
          <GripVertical className="text-muted-foreground size-4 cursor-grab" />

          {hasChildren ? (
            <button
              onClick={() => toggleItemExpansion(item.id)}
              className="hover:bg-muted rounded p-0.5"
            >
              {isExpanded ? (
                <ChevronDown className="size-4" />
              ) : (
                <ChevronRight className="size-4" />
              )}
            </button>
          ) : (
            <div className="w-5" />
          )}

          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-2">
              <span className="truncate font-medium">
                {isArabic ? item.label.ar : item.label.en}
              </span>
              {item.type === 'external' && (
                <ExternalLink className="text-muted-foreground size-3" />
              )}
            </div>
            <div className="text-muted-foreground flex items-center gap-2 text-xs">
              <LinkIcon className="size-3" />
              <span className="truncate">{item.url}</span>
            </div>
          </div>

          <div className="flex items-center gap-1 opacity-0 transition-opacity group-hover:opacity-100">
            <button
              onClick={() => moveItemUp(item.id, parentId)}
              className="hover:bg-muted rounded p-1.5 transition-colors"
              title={isArabic ? 'تحريك لأعلى' : 'Move Up'}
            >
              <ChevronDown className="size-4 rotate-180" />
            </button>
            <button
              onClick={() => toggleItemActive(item.id, parentId)}
              className="hover:bg-muted rounded p-1.5 transition-colors"
              title={item.isActive ? (isArabic ? 'إخفاء' : 'Hide') : isArabic ? 'إظهار' : 'Show'}
            >
              {item.isActive ? <Eye className="size-4" /> : <EyeOff className="size-4" />}
            </button>
            <button
              onClick={() => deleteItem(item.id, parentId)}
              className="rounded p-1.5 text-red-500 transition-colors hover:bg-red-500/10"
              title={isArabic ? 'حذف' : 'Delete'}
            >
              <Trash2 className="size-4" />
            </button>
          </div>
        </div>

        {hasChildren && isExpanded && (
          <div className="mt-1 space-y-1">
            {item.children?.map(child => renderMenuItem(child, item.id, level + 1))}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold">{isArabic ? 'بناء القوائم' : 'Menu Builder'}</h1>
          <p className="text-muted-foreground mt-1">
            {isArabic
              ? 'إنشاء وإدارة قوائم التنقل في الموقع'
              : 'Create and manage website navigation menus'}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowAddMenu(true)}
            className="hover:bg-muted inline-flex items-center justify-center gap-2 rounded-lg border px-4 py-2 transition-colors"
          >
            <Plus className="size-4" />
            <span>{isArabic ? 'قائمة جديدة' : 'New Menu'}</span>
          </button>
          <button
            onClick={() => setPreviewMode(!previewMode)}
            className={`inline-flex items-center justify-center gap-2 rounded-lg border px-4 py-2 transition-colors ${
              previewMode ? 'bg-primary text-primary-foreground' : 'hover:bg-muted'
            }`}
          >
            <Eye className="size-4" />
            <span>{isArabic ? 'معاينة' : 'Preview'}</span>
          </button>
          <button
            onClick={saveChanges}
            disabled={!hasChanges}
            className="bg-primary text-primary-foreground hover:bg-primary/90 inline-flex items-center justify-center gap-2 rounded-lg px-4 py-2 transition-colors disabled:cursor-not-allowed disabled:opacity-50"
          >
            <Save className="size-4" />
            <span>{isArabic ? 'حفظ' : 'Save'}</span>
          </button>
        </div>
      </div>

      {/* Changes indicator */}
      {hasChanges && (
        <div className="flex items-center gap-2 rounded-lg border border-yellow-500/20 bg-yellow-500/10 p-3">
          <div className="size-2 animate-pulse rounded-full bg-yellow-500" />
          <span className="text-sm text-yellow-600 dark:text-yellow-400">
            {isArabic ? 'لديك تغييرات غير محفوظة' : 'You have unsaved changes'}
          </span>
        </div>
      )}

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-4">
        {/* Menus Sidebar */}
        <div className="lg:col-span-1">
          <div className="bg-card space-y-2 rounded-lg border p-4">
            <h3 className="text-muted-foreground mb-3 text-sm font-medium">
              {isArabic ? 'القوائم' : 'Menus'}
            </h3>
            {menus.map(menu => {
              const LocationIcon = locationIcons[menu.location];
              return (
                <button
                  key={menu.id}
                  onClick={() => setSelectedMenu(menu.id)}
                  className={`flex w-full items-center justify-between rounded-lg p-3 text-sm transition-colors ${
                    selectedMenu === menu.id
                      ? 'bg-primary text-primary-foreground'
                      : 'hover:bg-muted'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <LocationIcon className="size-4" />
                    <span>{isArabic ? menu.nameAr : menu.name}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span
                      className={`rounded px-1.5 py-0.5 text-xs ${
                        selectedMenu === menu.id ? 'bg-primary-foreground/20' : 'bg-muted'
                      }`}
                    >
                      {menu.items.length}
                    </span>
                    {!menu.isActive && <EyeOff className="size-3" />}
                  </div>
                </button>
              );
            })}
          </div>

          {/* Location Legend */}
          <div className="bg-card mt-4 rounded-lg border p-4">
            <h3 className="text-muted-foreground mb-3 text-sm font-medium">
              {isArabic ? 'مواقع القوائم' : 'Menu Locations'}
            </h3>
            <div className="space-y-2 text-sm">
              {Object.entries(locationIcons).map(([loc, Icon]) => (
                <div key={loc} className="text-muted-foreground flex items-center gap-2">
                  <Icon className="size-4" />
                  <span className="capitalize">{loc}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Menu Editor */}
        <div className="lg:col-span-3">
          {currentMenu ? (
            <div className="bg-card rounded-lg border">
              {/* Menu Header */}
              <div className="flex items-center justify-between border-b p-4">
                <div>
                  <h2 className="font-medium">
                    {isArabic ? currentMenu.nameAr : currentMenu.name}
                  </h2>
                  <p className="text-muted-foreground text-sm">
                    {isArabic ? 'الموقع:' : 'Location:'}{' '}
                    <span className="capitalize">{currentMenu.location}</span>
                  </p>
                </div>
                <button
                  onClick={() => setShowAddItem(true)}
                  className="bg-primary text-primary-foreground hover:bg-primary/90 inline-flex items-center justify-center gap-2 rounded-lg px-3 py-1.5 text-sm transition-colors"
                >
                  <Plus className="size-4" />
                  <span>{isArabic ? 'إضافة عنصر' : 'Add Item'}</span>
                </button>
              </div>

              {/* Menu Items */}
              <div className="p-4">
                {currentMenu.items.length > 0 ? (
                  <div className="space-y-2">
                    {currentMenu.items
                      .sort((a, b) => a.order - b.order)
                      .map(item => renderMenuItem(item))}
                  </div>
                ) : (
                  <div className="text-muted-foreground py-12 text-center">
                    <MenuIcon className="mx-auto mb-3 size-12 opacity-50" />
                    <p>{isArabic ? 'لا توجد عناصر' : 'No items yet'}</p>
                    <button
                      onClick={() => setShowAddItem(true)}
                      className="text-primary mt-3 text-sm hover:underline"
                    >
                      {isArabic ? 'إضافة أول عنصر' : 'Add first item'}
                    </button>
                  </div>
                )}
              </div>

              {/* Info */}
              <div className="bg-muted/50 border-t p-4">
                <div className="text-muted-foreground flex items-start gap-2 text-sm">
                  <GripVertical className="mt-0.5 size-4" />
                  <span>
                    {isArabic
                      ? 'اسحب العناصر لإعادة ترتيبها. يمكنك إنشاء قوائم فرعية بإضافة عناصر كأبناء.'
                      : 'Drag items to reorder. You can create submenus by adding items as children.'}
                  </span>
                </div>
              </div>
            </div>
          ) : (
            <div className="bg-card text-muted-foreground rounded-lg border p-12 text-center">
              <MenuIcon className="mx-auto mb-3 size-12 opacity-50" />
              <p>{isArabic ? 'اختر قائمة للتعديل' : 'Select a menu to edit'}</p>
            </div>
          )}
        </div>
      </div>

      {/* Preview Modal */}
      {previewMode && currentMenu && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="bg-background w-full max-w-2xl rounded-lg">
            <div className="flex items-center justify-between border-b p-4">
              <h3 className="font-medium">{isArabic ? 'معاينة القائمة' : 'Menu Preview'}</h3>
              <button
                onClick={() => setPreviewMode(false)}
                className="hover:bg-muted rounded-lg p-2 transition-colors"
              >
                &times;
              </button>
            </div>
            <div className="p-6">
              <div className="grid grid-cols-2 gap-6">
                {/* Arabic Preview */}
                <div>
                  <h4 className="mb-3 text-center font-medium">العربية</h4>
                  <nav dir="rtl" className="bg-muted/50 rounded-lg p-4">
                    <ul className="space-y-2">
                      {currentMenu.items
                        .filter(item => item.isActive)
                        .map(item => (
                          <li key={item.id}>
                            <a
                              href={item.url}
                              className="hover:bg-muted block rounded p-2"
                              target={item.target}
                            >
                              {item.label.ar}
                              {item.type === 'external' && (
                                <ExternalLink className="ms-1 inline-block size-3" />
                              )}
                            </a>
                            {item.children && item.children.length > 0 && (
                              <ul className="ms-4 mt-1 space-y-1">
                                {item.children
                                  .filter(child => child.isActive)
                                  .map(child => (
                                    <li key={child.id}>
                                      <a
                                        href={child.url}
                                        className="hover:bg-muted block rounded p-2 text-sm"
                                        target={child.target}
                                      >
                                        {child.label.ar}
                                      </a>
                                    </li>
                                  ))}
                              </ul>
                            )}
                          </li>
                        ))}
                    </ul>
                  </nav>
                </div>

                {/* English Preview */}
                <div>
                  <h4 className="mb-3 text-center font-medium">English</h4>
                  <nav dir="ltr" className="bg-muted/50 rounded-lg p-4">
                    <ul className="space-y-2">
                      {currentMenu.items
                        .filter(item => item.isActive)
                        .map(item => (
                          <li key={item.id}>
                            <a
                              href={item.url}
                              className="hover:bg-muted block rounded p-2"
                              target={item.target}
                            >
                              {item.label.en}
                              {item.type === 'external' && (
                                <ExternalLink className="ms-1 inline-block size-3" />
                              )}
                            </a>
                            {item.children && item.children.length > 0 && (
                              <ul className="ms-4 mt-1 space-y-1">
                                {item.children
                                  .filter(child => child.isActive)
                                  .map(child => (
                                    <li key={child.id}>
                                      <a
                                        href={child.url}
                                        className="hover:bg-muted block rounded p-2 text-sm"
                                        target={child.target}
                                      >
                                        {child.label.en}
                                      </a>
                                    </li>
                                  ))}
                              </ul>
                            )}
                          </li>
                        ))}
                    </ul>
                  </nav>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Add Menu Modal */}
      {showAddMenu && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="bg-background w-full max-w-md rounded-lg">
            <div className="flex items-center justify-between border-b p-4">
              <h3 className="font-medium">{isArabic ? 'قائمة جديدة' : 'New Menu'}</h3>
              <button
                onClick={() => setShowAddMenu(false)}
                className="hover:bg-muted rounded-lg p-2 transition-colors"
              >
                &times;
              </button>
            </div>
            <div className="space-y-4 p-4">
              <div>
                <label className="mb-1.5 block text-sm font-medium">
                  {isArabic ? 'الاسم بالعربية' : 'Arabic Name'}
                </label>
                <input
                  type="text"
                  value={newMenu.nameAr}
                  onChange={e => setNewMenu({ ...newMenu, nameAr: e.target.value })}
                  dir="rtl"
                  className="bg-background focus:ring-primary w-full rounded-lg border p-2 focus:outline-none focus:ring-2"
                />
              </div>
              <div>
                <label className="mb-1.5 block text-sm font-medium">
                  {isArabic ? 'الاسم بالإنجليزية' : 'English Name'}
                </label>
                <input
                  type="text"
                  value={newMenu.name}
                  onChange={e => setNewMenu({ ...newMenu, name: e.target.value })}
                  className="bg-background focus:ring-primary w-full rounded-lg border p-2 focus:outline-none focus:ring-2"
                />
              </div>
              <div>
                <label className="mb-1.5 block text-sm font-medium">
                  {isArabic ? 'الموقع' : 'Location'}
                </label>
                <select
                  value={newMenu.location}
                  onChange={e =>
                    setNewMenu({ ...newMenu, location: e.target.value as Menu['location'] })
                  }
                  className="bg-background focus:ring-primary w-full rounded-lg border p-2 focus:outline-none focus:ring-2"
                >
                  <option value="header">Header</option>
                  <option value="footer">Footer</option>
                  <option value="sidebar">Sidebar</option>
                  <option value="mobile">Mobile</option>
                </select>
              </div>
              <div className="flex justify-end gap-2 pt-2">
                <button
                  onClick={() => setShowAddMenu(false)}
                  className="hover:bg-muted rounded-lg border px-4 py-2 transition-colors"
                >
                  {isArabic ? 'إلغاء' : 'Cancel'}
                </button>
                <button
                  onClick={addMenu}
                  disabled={!newMenu.name || !newMenu.nameAr}
                  className="bg-primary text-primary-foreground hover:bg-primary/90 rounded-lg px-4 py-2 transition-colors disabled:opacity-50"
                >
                  {isArabic ? 'إنشاء' : 'Create'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Add Item Modal */}
      {showAddItem && currentMenu && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="bg-background w-full max-w-md rounded-lg">
            <div className="flex items-center justify-between border-b p-4">
              <h3 className="font-medium">{isArabic ? 'إضافة عنصر' : 'Add Item'}</h3>
              <button
                onClick={() => setShowAddItem(false)}
                className="hover:bg-muted rounded-lg p-2 transition-colors"
              >
                &times;
              </button>
            </div>
            <div className="space-y-4 p-4">
              <div>
                <label className="mb-1.5 block text-sm font-medium">
                  {isArabic ? 'النص بالعربية' : 'Arabic Label'}
                </label>
                <input
                  type="text"
                  value={newItem.labelAr}
                  onChange={e => setNewItem({ ...newItem, labelAr: e.target.value })}
                  dir="rtl"
                  className="bg-background focus:ring-primary w-full rounded-lg border p-2 focus:outline-none focus:ring-2"
                />
              </div>
              <div>
                <label className="mb-1.5 block text-sm font-medium">
                  {isArabic ? 'النص بالإنجليزية' : 'English Label'}
                </label>
                <input
                  type="text"
                  value={newItem.labelEn}
                  onChange={e => setNewItem({ ...newItem, labelEn: e.target.value })}
                  className="bg-background focus:ring-primary w-full rounded-lg border p-2 focus:outline-none focus:ring-2"
                />
              </div>
              <div>
                <label className="mb-1.5 block text-sm font-medium">
                  {isArabic ? 'الرابط' : 'URL'}
                </label>
                <input
                  type="text"
                  value={newItem.url}
                  onChange={e => setNewItem({ ...newItem, url: e.target.value })}
                  placeholder="/page or https://..."
                  className="bg-background focus:ring-primary w-full rounded-lg border p-2 focus:outline-none focus:ring-2"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="mb-1.5 block text-sm font-medium">
                    {isArabic ? 'النوع' : 'Type'}
                  </label>
                  <select
                    value={newItem.type}
                    onChange={e =>
                      setNewItem({ ...newItem, type: e.target.value as 'internal' | 'external' })
                    }
                    className="bg-background focus:ring-primary w-full rounded-lg border p-2 focus:outline-none focus:ring-2"
                  >
                    <option value="internal">{isArabic ? 'داخلي' : 'Internal'}</option>
                    <option value="external">{isArabic ? 'خارجي' : 'External'}</option>
                  </select>
                </div>
                <div>
                  <label className="mb-1.5 block text-sm font-medium">
                    {isArabic ? 'الهدف' : 'Target'}
                  </label>
                  <select
                    value={newItem.target}
                    onChange={e =>
                      setNewItem({ ...newItem, target: e.target.value as '_self' | '_blank' })
                    }
                    className="bg-background focus:ring-primary w-full rounded-lg border p-2 focus:outline-none focus:ring-2"
                  >
                    <option value="_self">{isArabic ? 'نفس النافذة' : 'Same Window'}</option>
                    <option value="_blank">{isArabic ? 'نافذة جديدة' : 'New Window'}</option>
                  </select>
                </div>
              </div>
              {currentMenu.items.length > 0 && (
                <div>
                  <label className="mb-1.5 block text-sm font-medium">
                    {isArabic ? 'العنصر الأب (اختياري)' : 'Parent Item (optional)'}
                  </label>
                  <select
                    value={newItem.parentId || ''}
                    onChange={e => setNewItem({ ...newItem, parentId: e.target.value || null })}
                    className="bg-background focus:ring-primary w-full rounded-lg border p-2 focus:outline-none focus:ring-2"
                  >
                    <option value="">{isArabic ? 'بدون أب' : 'No Parent'}</option>
                    {currentMenu.items.map(item => (
                      <option key={item.id} value={item.id}>
                        {isArabic ? item.label.ar : item.label.en}
                      </option>
                    ))}
                  </select>
                </div>
              )}
              <div className="flex justify-end gap-2 pt-2">
                <button
                  onClick={() => setShowAddItem(false)}
                  className="hover:bg-muted rounded-lg border px-4 py-2 transition-colors"
                >
                  {isArabic ? 'إلغاء' : 'Cancel'}
                </button>
                <button
                  onClick={addItem}
                  disabled={!newItem.labelAr || !newItem.labelEn || !newItem.url}
                  className="bg-primary text-primary-foreground hover:bg-primary/90 rounded-lg px-4 py-2 transition-colors disabled:opacity-50"
                >
                  {isArabic ? 'إضافة' : 'Add'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
