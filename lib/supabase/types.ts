export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "14.5"
  }
  public: {
    Tables: {
      activity_events: {
        Row: {
          event_type: string
          id: string
          occurred_at: string
          organization_id: string
          payload: Json
          project_id: string | null
          user_id: string | null
        }
        Insert: {
          event_type: string
          id?: string
          occurred_at?: string
          organization_id: string
          payload?: Json
          project_id?: string | null
          user_id?: string | null
        }
        Update: {
          event_type?: string
          id?: string
          occurred_at?: string
          organization_id?: string
          payload?: Json
          project_id?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "activity_events_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "activity_events_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
        ]
      }
      handover_tickets: {
        Row: {
          confirmed_at: string | null
          confirmed_by: string | null
          confirmed_qty: number | null
          discrepancy_logged: boolean
          generated_at: string
          id: string
          issuance_txn_id: string | null
          notes: string | null
          organization_id: string
          project_id: string
          qr_token: string
        }
        Insert: {
          confirmed_at?: string | null
          confirmed_by?: string | null
          confirmed_qty?: number | null
          discrepancy_logged?: boolean
          generated_at?: string
          id?: string
          issuance_txn_id?: string | null
          notes?: string | null
          organization_id: string
          project_id: string
          qr_token: string
        }
        Update: {
          confirmed_at?: string | null
          confirmed_by?: string | null
          confirmed_qty?: number | null
          discrepancy_logged?: boolean
          generated_at?: string
          id?: string
          issuance_txn_id?: string | null
          notes?: string | null
          organization_id?: string
          project_id?: string
          qr_token?: string
        }
        Relationships: [
          {
            foreignKeyName: "handover_tickets_issuance_fk"
            columns: ["issuance_txn_id"]
            isOneToOne: false
            referencedRelation: "stock_transactions"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "handover_tickets_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "handover_tickets_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
        ]
      }
      labour_lines: {
        Row: {
          created_at: string
          crew_size: number
          hours: number
          id: string
          is_overridden: boolean
          notes: string | null
          organization_id: string
          override_hours: number | null
          override_rate: number | null
          phase_id: string
          rate: number
          source: string
          system_instance_id: string
        }
        Insert: {
          created_at?: string
          crew_size?: number
          hours: number
          id?: string
          is_overridden?: boolean
          notes?: string | null
          organization_id: string
          override_hours?: number | null
          override_rate?: number | null
          phase_id: string
          rate: number
          source: string
          system_instance_id: string
        }
        Update: {
          created_at?: string
          crew_size?: number
          hours?: number
          id?: string
          is_overridden?: boolean
          notes?: string | null
          organization_id?: string
          override_hours?: number | null
          override_rate?: number | null
          phase_id?: string
          rate?: number
          source?: string
          system_instance_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "labour_lines_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "labour_lines_phase_id_fkey"
            columns: ["phase_id"]
            isOneToOne: false
            referencedRelation: "phases"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "labour_lines_system_instance_id_fkey"
            columns: ["system_instance_id"]
            isOneToOne: false
            referencedRelation: "system_instances"
            referencedColumns: ["id"]
          },
        ]
      }
      material_categories: {
        Row: {
          created_at: string
          id: string
          name: string
          organization_id: string
          parameter_definitions: Json
        }
        Insert: {
          created_at?: string
          id?: string
          name: string
          organization_id: string
          parameter_definitions?: Json
        }
        Update: {
          created_at?: string
          id?: string
          name?: string
          organization_id?: string
          parameter_definitions?: Json
        }
        Relationships: [
          {
            foreignKeyName: "material_categories_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
        ]
      }
      material_versions: {
        Row: {
          created_at: string
          default_kerf_mm: number | null
          default_wastage_pct: number | null
          grain_direction: string | null
          id: string
          is_cuttable: string | null
          material_id: string
          min_reusable_offcut_mm: number | null
          pack_size: number | null
          parameter_values: Json
          reorder_level: number | null
          stock_lengths: number[] | null
          stock_sheet_size: Json | null
          unit: string
          unit_cost: number
          version: number
        }
        Insert: {
          created_at?: string
          default_kerf_mm?: number | null
          default_wastage_pct?: number | null
          grain_direction?: string | null
          id?: string
          is_cuttable?: string | null
          material_id: string
          min_reusable_offcut_mm?: number | null
          pack_size?: number | null
          parameter_values?: Json
          reorder_level?: number | null
          stock_lengths?: number[] | null
          stock_sheet_size?: Json | null
          unit: string
          unit_cost?: number
          version: number
        }
        Update: {
          created_at?: string
          default_kerf_mm?: number | null
          default_wastage_pct?: number | null
          grain_direction?: string | null
          id?: string
          is_cuttable?: string | null
          material_id?: string
          min_reusable_offcut_mm?: number | null
          pack_size?: number | null
          parameter_values?: Json
          reorder_level?: number | null
          stock_lengths?: number[] | null
          stock_sheet_size?: Json | null
          unit?: string
          unit_cost?: number
          version?: number
        }
        Relationships: [
          {
            foreignKeyName: "material_versions_material_id_fkey"
            columns: ["material_id"]
            isOneToOne: false
            referencedRelation: "materials"
            referencedColumns: ["id"]
          },
        ]
      }
      materials: {
        Row: {
          category_id: string | null
          code: string
          created_at: string
          emoji: string | null
          id: string
          image_url: string | null
          name: string
          organization_id: string
          primary_location_id: string | null
          supplier_id: string | null
        }
        Insert: {
          category_id?: string | null
          code: string
          created_at?: string
          emoji?: string | null
          id?: string
          image_url?: string | null
          name: string
          organization_id: string
          primary_location_id?: string | null
          supplier_id?: string | null
        }
        Update: {
          category_id?: string | null
          code?: string
          created_at?: string
          emoji?: string | null
          id?: string
          image_url?: string | null
          name?: string
          organization_id?: string
          primary_location_id?: string | null
          supplier_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "materials_category_id_fkey"
            columns: ["category_id"]
            isOneToOne: false
            referencedRelation: "material_categories"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "materials_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "materials_primary_location_id_fkey"
            columns: ["primary_location_id"]
            isOneToOne: false
            referencedRelation: "warehouse_locations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "materials_supplier_id_fkey"
            columns: ["supplier_id"]
            isOneToOne: false
            referencedRelation: "suppliers"
            referencedColumns: ["id"]
          },
        ]
      }
      memberships: {
        Row: {
          created_at: string
          organization_id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          created_at?: string
          organization_id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          created_at?: string
          organization_id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "memberships_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
        ]
      }
      model_versions: {
        Row: {
          certifications: Json
          created_at: string
          created_by: string | null
          custom_dimensions: Json
          id: string
          is_published: boolean
          labour_rules: Json
          model_id: string
          model_selectable_gates: Json
          parts_list: Json
          published_at: string | null
          supported_shape_ids: string[]
          supported_substrate_ids: string[]
          variants: Json
          version: number
        }
        Insert: {
          certifications?: Json
          created_at?: string
          created_by?: string | null
          custom_dimensions?: Json
          id?: string
          is_published?: boolean
          labour_rules?: Json
          model_id: string
          model_selectable_gates?: Json
          parts_list?: Json
          published_at?: string | null
          supported_shape_ids?: string[]
          supported_substrate_ids?: string[]
          variants?: Json
          version: number
        }
        Update: {
          certifications?: Json
          created_at?: string
          created_by?: string | null
          custom_dimensions?: Json
          id?: string
          is_published?: boolean
          labour_rules?: Json
          model_id?: string
          model_selectable_gates?: Json
          parts_list?: Json
          published_at?: string | null
          supported_shape_ids?: string[]
          supported_substrate_ids?: string[]
          variants?: Json
          version?: number
        }
        Relationships: [
          {
            foreignKeyName: "model_versions_model_id_fkey"
            columns: ["model_id"]
            isOneToOne: false
            referencedRelation: "models"
            referencedColumns: ["id"]
          },
        ]
      }
      models: {
        Row: {
          code: string | null
          created_at: string
          id: string
          name: string
          organization_id: string
          system_id: string
        }
        Insert: {
          code?: string | null
          created_at?: string
          id?: string
          name: string
          organization_id: string
          system_id: string
        }
        Update: {
          code?: string | null
          created_at?: string
          id?: string
          name?: string
          organization_id?: string
          system_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "models_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "models_system_id_fkey"
            columns: ["system_id"]
            isOneToOne: false
            referencedRelation: "systems"
            referencedColumns: ["id"]
          },
        ]
      }
      mto_lines: {
        Row: {
          created_at: string
          cut_plan: Json | null
          id: string
          is_overridden: boolean
          material_version_id: string | null
          organization_id: string
          override_material_version_id: string | null
          override_qty: number | null
          override_reason: string | null
          quantity: number
          rule_row_id: string | null
          source: string
          sub_assembly_alias: string | null
          system_instance_id: string
          unit: string
          unit_cost: number
          wastage_pct: number | null
        }
        Insert: {
          created_at?: string
          cut_plan?: Json | null
          id?: string
          is_overridden?: boolean
          material_version_id?: string | null
          organization_id: string
          override_material_version_id?: string | null
          override_qty?: number | null
          override_reason?: string | null
          quantity: number
          rule_row_id?: string | null
          source: string
          sub_assembly_alias?: string | null
          system_instance_id: string
          unit: string
          unit_cost?: number
          wastage_pct?: number | null
        }
        Update: {
          created_at?: string
          cut_plan?: Json | null
          id?: string
          is_overridden?: boolean
          material_version_id?: string | null
          organization_id?: string
          override_material_version_id?: string | null
          override_qty?: number | null
          override_reason?: string | null
          quantity?: number
          rule_row_id?: string | null
          source?: string
          sub_assembly_alias?: string | null
          system_instance_id?: string
          unit?: string
          unit_cost?: number
          wastage_pct?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "mto_lines_material_version_id_fkey"
            columns: ["material_version_id"]
            isOneToOne: false
            referencedRelation: "material_versions"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "mto_lines_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "mto_lines_override_material_version_id_fkey"
            columns: ["override_material_version_id"]
            isOneToOne: false
            referencedRelation: "material_versions"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "mto_lines_system_instance_id_fkey"
            columns: ["system_instance_id"]
            isOneToOne: false
            referencedRelation: "system_instances"
            referencedColumns: ["id"]
          },
        ]
      }
      mto_states: {
        Row: {
          approved_at: string | null
          approved_by: string | null
          project_id: string
          rejected_at: string | null
          rejected_by: string | null
          rejection_reason: string | null
          state: string
          submitted_at: string | null
          submitted_by: string | null
          updated_at: string
        }
        Insert: {
          approved_at?: string | null
          approved_by?: string | null
          project_id: string
          rejected_at?: string | null
          rejected_by?: string | null
          rejection_reason?: string | null
          state?: string
          submitted_at?: string | null
          submitted_by?: string | null
          updated_at?: string
        }
        Update: {
          approved_at?: string | null
          approved_by?: string | null
          project_id?: string
          rejected_at?: string | null
          rejected_by?: string | null
          rejection_reason?: string | null
          state?: string
          submitted_at?: string | null
          submitted_by?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "mto_states_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: true
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
        ]
      }
      organizations: {
        Row: {
          created_at: string
          currency: string
          id: string
          logo_url: string | null
          name: string
          slug: string | null
        }
        Insert: {
          created_at?: string
          currency?: string
          id?: string
          logo_url?: string | null
          name: string
          slug?: string | null
        }
        Update: {
          created_at?: string
          currency?: string
          id?: string
          logo_url?: string | null
          name?: string
          slug?: string | null
        }
        Relationships: []
      }
      phases: {
        Row: {
          colour: string
          created_at: string
          default_crew_size: number
          default_rate: number
          display_order: number
          id: string
          include_in_totals: boolean
          key: string
          label: string
          organization_id: string
        }
        Insert: {
          colour: string
          created_at?: string
          default_crew_size?: number
          default_rate?: number
          display_order?: number
          id?: string
          include_in_totals?: boolean
          key: string
          label: string
          organization_id: string
        }
        Update: {
          colour?: string
          created_at?: string
          default_crew_size?: number
          default_rate?: number
          display_order?: number
          id?: string
          include_in_totals?: boolean
          key?: string
          label?: string
          organization_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "phases_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
        ]
      }
      photos: {
        Row: {
          caption: string | null
          deleted_at: string | null
          exif_metadata: Json | null
          id: string
          organization_id: string
          photo_type: string
          progress_percent_at_capture: number | null
          project_id: string
          storage_path: string
          task_id: string | null
          uploaded_at: string
          uploaded_by: string
        }
        Insert: {
          caption?: string | null
          deleted_at?: string | null
          exif_metadata?: Json | null
          id?: string
          organization_id: string
          photo_type: string
          progress_percent_at_capture?: number | null
          project_id: string
          storage_path: string
          task_id?: string | null
          uploaded_at?: string
          uploaded_by: string
        }
        Update: {
          caption?: string | null
          deleted_at?: string | null
          exif_metadata?: Json | null
          id?: string
          organization_id?: string
          photo_type?: string
          progress_percent_at_capture?: number | null
          project_id?: string
          storage_path?: string
          task_id?: string | null
          uploaded_at?: string
          uploaded_by?: string
        }
        Relationships: [
          {
            foreignKeyName: "photos_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "photos_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "photos_task_id_fkey"
            columns: ["task_id"]
            isOneToOne: false
            referencedRelation: "tasks"
            referencedColumns: ["id"]
          },
        ]
      }
      po_lines: {
        Row: {
          id: string
          material_id: string
          ordered_qty: number
          po_id: string
          unit_cost: number
        }
        Insert: {
          id?: string
          material_id: string
          ordered_qty: number
          po_id: string
          unit_cost: number
        }
        Update: {
          id?: string
          material_id?: string
          ordered_qty?: number
          po_id?: string
          unit_cost?: number
        }
        Relationships: [
          {
            foreignKeyName: "po_lines_material_id_fkey"
            columns: ["material_id"]
            isOneToOne: false
            referencedRelation: "materials"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "po_lines_po_id_fkey"
            columns: ["po_id"]
            isOneToOne: false
            referencedRelation: "purchase_orders"
            referencedColumns: ["id"]
          },
        ]
      }
      po_project_links: {
        Row: {
          po_id: string
          project_id: string
        }
        Insert: {
          po_id: string
          project_id: string
        }
        Update: {
          po_id?: string
          project_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "po_project_links_po_id_fkey"
            columns: ["po_id"]
            isOneToOne: false
            referencedRelation: "purchase_orders"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "po_project_links_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
        ]
      }
      project_assignments: {
        Row: {
          assigned_at: string
          project_id: string
          role: string
          user_id: string
        }
        Insert: {
          assigned_at?: string
          project_id: string
          role: string
          user_id: string
        }
        Update: {
          assigned_at?: string
          project_id?: string
          role?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "project_assignments_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
        ]
      }
      projects: {
        Row: {
          client_name: string | null
          code: string | null
          created_at: string
          created_by: string | null
          id: string
          location: string | null
          name: string
          needed_by_date: string | null
          organization_id: string
          site_contact: string | null
          start_date: string | null
          status: string
        }
        Insert: {
          client_name?: string | null
          code?: string | null
          created_at?: string
          created_by?: string | null
          id?: string
          location?: string | null
          name: string
          needed_by_date?: string | null
          organization_id: string
          site_contact?: string | null
          start_date?: string | null
          status?: string
        }
        Update: {
          client_name?: string | null
          code?: string | null
          created_at?: string
          created_by?: string | null
          id?: string
          location?: string | null
          name?: string
          needed_by_date?: string | null
          organization_id?: string
          site_contact?: string | null
          start_date?: string | null
          status?: string
        }
        Relationships: [
          {
            foreignKeyName: "projects_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
        ]
      }
      purchase_orders: {
        Row: {
          approved_by: string | null
          created_at: string
          created_by: string | null
          expected_delivery: string | null
          id: string
          organization_id: string
          po_number: string
          qr_token: string
          sent_at: string | null
          source: string
          status: string
          supplier_id: string
        }
        Insert: {
          approved_by?: string | null
          created_at?: string
          created_by?: string | null
          expected_delivery?: string | null
          id?: string
          organization_id: string
          po_number: string
          qr_token: string
          sent_at?: string | null
          source: string
          status?: string
          supplier_id: string
        }
        Update: {
          approved_by?: string | null
          created_at?: string
          created_by?: string | null
          expected_delivery?: string | null
          id?: string
          organization_id?: string
          po_number?: string
          qr_token?: string
          sent_at?: string | null
          source?: string
          status?: string
          supplier_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "purchase_orders_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "purchase_orders_supplier_id_fkey"
            columns: ["supplier_id"]
            isOneToOne: false
            referencedRelation: "suppliers"
            referencedColumns: ["id"]
          },
        ]
      }
      push_subscriptions: {
        Row: {
          created_at: string
          endpoint: string
          keys: Json
          user_agent: string | null
          user_id: string
        }
        Insert: {
          created_at?: string
          endpoint: string
          keys: Json
          user_agent?: string | null
          user_id: string
        }
        Update: {
          created_at?: string
          endpoint?: string
          keys?: Json
          user_agent?: string | null
          user_id?: string
        }
        Relationships: []
      }
      quotes: {
        Row: {
          awarded_at: string | null
          contingency_pct: number | null
          created_at: string
          expiry_date: string | null
          id: string
          margin_pct: number | null
          name: string | null
          organization_id: string
          project_id: string
          quote_number: string
          status: string
          tax_pct: number | null
          total_cost: number | null
        }
        Insert: {
          awarded_at?: string | null
          contingency_pct?: number | null
          created_at?: string
          expiry_date?: string | null
          id?: string
          margin_pct?: number | null
          name?: string | null
          organization_id: string
          project_id: string
          quote_number: string
          status?: string
          tax_pct?: number | null
          total_cost?: number | null
        }
        Update: {
          awarded_at?: string | null
          contingency_pct?: number | null
          created_at?: string
          expiry_date?: string | null
          id?: string
          margin_pct?: number | null
          name?: string | null
          organization_id?: string
          project_id?: string
          quote_number?: string
          status?: string
          tax_pct?: number | null
          total_cost?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "quotes_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "quotes_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
        ]
      }
      schedule_templates: {
        Row: {
          created_at: string
          id: string
          name: string
          organization_id: string
          system_id: string
          template_tasks: Json
        }
        Insert: {
          created_at?: string
          id?: string
          name: string
          organization_id: string
          system_id: string
          template_tasks?: Json
        }
        Update: {
          created_at?: string
          id?: string
          name?: string
          organization_id?: string
          system_id?: string
          template_tasks?: Json
        }
        Relationships: [
          {
            foreignKeyName: "schedule_templates_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "schedule_templates_system_id_fkey"
            columns: ["system_id"]
            isOneToOne: true
            referencedRelation: "systems"
            referencedColumns: ["id"]
          },
        ]
      }
      shape_versions: {
        Row: {
          created_at: string
          dimension_schema_delta: Json
          id: string
          is_published: boolean
          shape_id: string
          version: number
        }
        Insert: {
          created_at?: string
          dimension_schema_delta?: Json
          id?: string
          is_published?: boolean
          shape_id: string
          version: number
        }
        Update: {
          created_at?: string
          dimension_schema_delta?: Json
          id?: string
          is_published?: boolean
          shape_id?: string
          version?: number
        }
        Relationships: [
          {
            foreignKeyName: "shape_versions_shape_id_fkey"
            columns: ["shape_id"]
            isOneToOne: false
            referencedRelation: "shapes"
            referencedColumns: ["id"]
          },
        ]
      }
      shapes: {
        Row: {
          created_at: string
          description: string | null
          id: string
          name: string
          organization_id: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          id?: string
          name: string
          organization_id: string
        }
        Update: {
          created_at?: string
          description?: string | null
          id?: string
          name?: string
          organization_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "shapes_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
        ]
      }
      stock_transactions: {
        Row: {
          handover_ticket_id: string | null
          id: string
          location_id: string
          material_id: string
          mto_line_id: string | null
          notes: string | null
          organization_id: string
          performed_at: string
          performed_by: string | null
          po_id: string | null
          project_id: string | null
          qty: number
          transfer_pair_id: string | null
          txn_type: string
        }
        Insert: {
          handover_ticket_id?: string | null
          id?: string
          location_id: string
          material_id: string
          mto_line_id?: string | null
          notes?: string | null
          organization_id: string
          performed_at?: string
          performed_by?: string | null
          po_id?: string | null
          project_id?: string | null
          qty: number
          transfer_pair_id?: string | null
          txn_type: string
        }
        Update: {
          handover_ticket_id?: string | null
          id?: string
          location_id?: string
          material_id?: string
          mto_line_id?: string | null
          notes?: string | null
          organization_id?: string
          performed_at?: string
          performed_by?: string | null
          po_id?: string | null
          project_id?: string | null
          qty?: number
          transfer_pair_id?: string | null
          txn_type?: string
        }
        Relationships: [
          {
            foreignKeyName: "stock_transactions_handover_ticket_id_fkey"
            columns: ["handover_ticket_id"]
            isOneToOne: false
            referencedRelation: "handover_tickets"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "stock_transactions_location_id_fkey"
            columns: ["location_id"]
            isOneToOne: false
            referencedRelation: "warehouse_locations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "stock_transactions_material_id_fkey"
            columns: ["material_id"]
            isOneToOne: false
            referencedRelation: "materials"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "stock_transactions_mto_line_id_fkey"
            columns: ["mto_line_id"]
            isOneToOne: false
            referencedRelation: "mto_lines"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "stock_transactions_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "stock_transactions_po_id_fkey"
            columns: ["po_id"]
            isOneToOne: false
            referencedRelation: "purchase_orders"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "stock_transactions_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
        ]
      }
      sub_assemblies: {
        Row: {
          created_at: string
          id: string
          name: string
          organization_id: string
          scope: string
          scope_model_id: string | null
          scope_system_id: string | null
        }
        Insert: {
          created_at?: string
          id?: string
          name: string
          organization_id: string
          scope: string
          scope_model_id?: string | null
          scope_system_id?: string | null
        }
        Update: {
          created_at?: string
          id?: string
          name?: string
          organization_id?: string
          scope?: string
          scope_model_id?: string | null
          scope_system_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "sub_assemblies_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "sub_assemblies_scope_model_fk"
            columns: ["scope_model_id"]
            isOneToOne: false
            referencedRelation: "models"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "sub_assemblies_scope_system_id_fkey"
            columns: ["scope_system_id"]
            isOneToOne: false
            referencedRelation: "systems"
            referencedColumns: ["id"]
          },
        ]
      }
      sub_assembly_versions: {
        Row: {
          created_at: string
          created_by: string | null
          id: string
          is_published: boolean
          labour_rules: Json
          parameter_signature: Json
          parts_list: Json
          published_at: string | null
          sub_assembly_id: string
          version: number
        }
        Insert: {
          created_at?: string
          created_by?: string | null
          id?: string
          is_published?: boolean
          labour_rules?: Json
          parameter_signature?: Json
          parts_list?: Json
          published_at?: string | null
          sub_assembly_id: string
          version: number
        }
        Update: {
          created_at?: string
          created_by?: string | null
          id?: string
          is_published?: boolean
          labour_rules?: Json
          parameter_signature?: Json
          parts_list?: Json
          published_at?: string | null
          sub_assembly_id?: string
          version?: number
        }
        Relationships: [
          {
            foreignKeyName: "sub_assembly_versions_sub_assembly_id_fkey"
            columns: ["sub_assembly_id"]
            isOneToOne: false
            referencedRelation: "sub_assemblies"
            referencedColumns: ["id"]
          },
        ]
      }
      substrates: {
        Row: {
          created_at: string
          id: string
          name: string
          notes: string | null
          organization_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          name: string
          notes?: string | null
          organization_id: string
        }
        Update: {
          created_at?: string
          id?: string
          name?: string
          notes?: string | null
          organization_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "substrates_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
        ]
      }
      suppliers: {
        Row: {
          contact: string | null
          created_at: string
          id: string
          name: string
          notes: string | null
          organization_id: string
        }
        Insert: {
          contact?: string | null
          created_at?: string
          id?: string
          name: string
          notes?: string | null
          organization_id: string
        }
        Update: {
          contact?: string | null
          created_at?: string
          id?: string
          name?: string
          notes?: string | null
          organization_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "suppliers_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
        ]
      }
      system_instances: {
        Row: {
          created_at: string
          dimensions: Json
          id: string
          model_version_id: string
          name: string | null
          organization_id: string
          project_id: string | null
          quote_id: string | null
          shape_version_id: string | null
          substrate_id: string | null
          system_version_id: string
          user_input_parameters: Json
          variant_selections: Json
        }
        Insert: {
          created_at?: string
          dimensions?: Json
          id?: string
          model_version_id: string
          name?: string | null
          organization_id: string
          project_id?: string | null
          quote_id?: string | null
          shape_version_id?: string | null
          substrate_id?: string | null
          system_version_id: string
          user_input_parameters?: Json
          variant_selections?: Json
        }
        Update: {
          created_at?: string
          dimensions?: Json
          id?: string
          model_version_id?: string
          name?: string | null
          organization_id?: string
          project_id?: string | null
          quote_id?: string | null
          shape_version_id?: string | null
          substrate_id?: string | null
          system_version_id?: string
          user_input_parameters?: Json
          variant_selections?: Json
        }
        Relationships: [
          {
            foreignKeyName: "system_instances_model_version_id_fkey"
            columns: ["model_version_id"]
            isOneToOne: false
            referencedRelation: "model_versions"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "system_instances_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "system_instances_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "system_instances_quote_id_fkey"
            columns: ["quote_id"]
            isOneToOne: false
            referencedRelation: "quotes"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "system_instances_shape_version_id_fkey"
            columns: ["shape_version_id"]
            isOneToOne: false
            referencedRelation: "shape_versions"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "system_instances_substrate_id_fkey"
            columns: ["substrate_id"]
            isOneToOne: false
            referencedRelation: "substrates"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "system_instances_system_version_id_fkey"
            columns: ["system_version_id"]
            isOneToOne: false
            referencedRelation: "system_versions"
            referencedColumns: ["id"]
          },
        ]
      }
      system_versions: {
        Row: {
          allowed_shapes: string[]
          allowed_substrates: string[]
          created_at: string
          created_by: string | null
          default_schedule_template_id: string | null
          dimension_schema: Json
          id: string
          is_published: boolean
          published_at: string | null
          system_id: string
          version: number
        }
        Insert: {
          allowed_shapes?: string[]
          allowed_substrates?: string[]
          created_at?: string
          created_by?: string | null
          default_schedule_template_id?: string | null
          dimension_schema?: Json
          id?: string
          is_published?: boolean
          published_at?: string | null
          system_id: string
          version: number
        }
        Update: {
          allowed_shapes?: string[]
          allowed_substrates?: string[]
          created_at?: string
          created_by?: string | null
          default_schedule_template_id?: string | null
          dimension_schema?: Json
          id?: string
          is_published?: boolean
          published_at?: string | null
          system_id?: string
          version?: number
        }
        Relationships: [
          {
            foreignKeyName: "system_versions_default_template_fk"
            columns: ["default_schedule_template_id"]
            isOneToOne: false
            referencedRelation: "schedule_templates"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "system_versions_system_id_fkey"
            columns: ["system_id"]
            isOneToOne: false
            referencedRelation: "systems"
            referencedColumns: ["id"]
          },
        ]
      }
      systems: {
        Row: {
          created_at: string
          description: string | null
          id: string
          name: string
          organization_id: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          id?: string
          name: string
          organization_id: string
        }
        Update: {
          created_at?: string
          description?: string | null
          id?: string
          name?: string
          organization_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "systems_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
        ]
      }
      task_dependencies: {
        Row: {
          lag_days: number
          predecessor_task_id: string
          task_id: string
        }
        Insert: {
          lag_days?: number
          predecessor_task_id: string
          task_id: string
        }
        Update: {
          lag_days?: number
          predecessor_task_id?: string
          task_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "task_dependencies_predecessor_task_id_fkey"
            columns: ["predecessor_task_id"]
            isOneToOne: false
            referencedRelation: "tasks"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "task_dependencies_task_id_fkey"
            columns: ["task_id"]
            isOneToOne: false
            referencedRelation: "tasks"
            referencedColumns: ["id"]
          },
        ]
      }
      task_mto_lines: {
        Row: {
          mto_line_id: string
          task_id: string
        }
        Insert: {
          mto_line_id: string
          task_id: string
        }
        Update: {
          mto_line_id?: string
          task_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "task_mto_lines_mto_line_id_fkey"
            columns: ["mto_line_id"]
            isOneToOne: false
            referencedRelation: "mto_lines"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "task_mto_lines_task_id_fkey"
            columns: ["task_id"]
            isOneToOne: false
            referencedRelation: "tasks"
            referencedColumns: ["id"]
          },
        ]
      }
      tasks: {
        Row: {
          assignee_user_id: string | null
          created_at: string
          duration_days: number | null
          end_date: string | null
          id: string
          is_milestone: boolean
          is_on_hold: boolean
          manual_status: string | null
          name: string
          notes: string | null
          organization_id: string
          parent_task_id: string | null
          phase_id: string | null
          progress_percent: number | null
          project_id: string
          start_date: string | null
          system_instance_id: string | null
        }
        Insert: {
          assignee_user_id?: string | null
          created_at?: string
          duration_days?: number | null
          end_date?: string | null
          id?: string
          is_milestone?: boolean
          is_on_hold?: boolean
          manual_status?: string | null
          name: string
          notes?: string | null
          organization_id: string
          parent_task_id?: string | null
          phase_id?: string | null
          progress_percent?: number | null
          project_id: string
          start_date?: string | null
          system_instance_id?: string | null
        }
        Update: {
          assignee_user_id?: string | null
          created_at?: string
          duration_days?: number | null
          end_date?: string | null
          id?: string
          is_milestone?: boolean
          is_on_hold?: boolean
          manual_status?: string | null
          name?: string
          notes?: string | null
          organization_id?: string
          parent_task_id?: string | null
          phase_id?: string | null
          progress_percent?: number | null
          project_id?: string
          start_date?: string | null
          system_instance_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "tasks_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "tasks_parent_task_id_fkey"
            columns: ["parent_task_id"]
            isOneToOne: false
            referencedRelation: "tasks"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "tasks_phase_id_fkey"
            columns: ["phase_id"]
            isOneToOne: false
            referencedRelation: "phases"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "tasks_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "tasks_system_instance_id_fkey"
            columns: ["system_instance_id"]
            isOneToOne: false
            referencedRelation: "system_instances"
            referencedColumns: ["id"]
          },
        ]
      }
      tenant_settings: {
        Row: {
          approval_thresholds: Json | null
          branding: Json
          category_wastage_overrides: Json | null
          created_at: string
          default_wastage_pct: number | null
          exif_strip_on_export: boolean
          holidays: string[]
          material_code_pattern: string | null
          organization_id: string
          updated_at: string
          working_days: number[]
          working_hours_per_day: number
        }
        Insert: {
          approval_thresholds?: Json | null
          branding?: Json
          category_wastage_overrides?: Json | null
          created_at?: string
          default_wastage_pct?: number | null
          exif_strip_on_export?: boolean
          holidays?: string[]
          material_code_pattern?: string | null
          organization_id: string
          updated_at?: string
          working_days?: number[]
          working_hours_per_day?: number
        }
        Update: {
          approval_thresholds?: Json | null
          branding?: Json
          category_wastage_overrides?: Json | null
          created_at?: string
          default_wastage_pct?: number | null
          exif_strip_on_export?: boolean
          holidays?: string[]
          material_code_pattern?: string | null
          organization_id?: string
          updated_at?: string
          working_days?: number[]
          working_hours_per_day?: number
        }
        Relationships: [
          {
            foreignKeyName: "tenant_settings_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: true
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
        ]
      }
      warehouse_locations: {
        Row: {
          created_at: string
          id: string
          is_mobile: boolean
          name: string
          organization_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          is_mobile?: boolean
          name: string
          organization_id: string
        }
        Update: {
          created_at?: string
          id?: string
          is_mobile?: boolean
          name?: string
          organization_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "warehouse_locations_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      current_memberships: {
        Row: {
          created_at: string | null
          organization_id: string | null
          role: Database["public"]["Enums"]["app_role"] | null
          user_id: string | null
        }
        Insert: {
          created_at?: string | null
          organization_id?: string | null
          role?: Database["public"]["Enums"]["app_role"] | null
          user_id?: string | null
        }
        Update: {
          created_at?: string | null
          organization_id?: string | null
          role?: Database["public"]["Enums"]["app_role"] | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "memberships_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
        ]
      }
      stock_balances: {
        Row: {
          balance: number | null
          location_id: string | null
          material_id: string | null
          organization_id: string | null
        }
        Relationships: [
          {
            foreignKeyName: "stock_transactions_location_id_fkey"
            columns: ["location_id"]
            isOneToOne: false
            referencedRelation: "warehouse_locations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "stock_transactions_material_id_fkey"
            columns: ["material_id"]
            isOneToOne: false
            referencedRelation: "materials"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "stock_transactions_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Functions: {
      user_has_role: {
        Args: {
          _org: string
          _roles: Database["public"]["Enums"]["app_role"][]
        }
        Returns: boolean
      }
      user_organizations: { Args: never; Returns: string[] }
    }
    Enums: {
      app_role:
        | "tenant_owner"
        | "tenant_admin"
        | "project_manager"
        | "estimator"
        | "project_viewer"
        | "storeman"
        | "site_foreman"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      app_role: [
        "tenant_owner",
        "tenant_admin",
        "project_manager",
        "estimator",
        "project_viewer",
        "storeman",
        "site_foreman",
      ],
    },
  },
} as const
