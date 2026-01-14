#!/bin/bash

# Run Database Migrations via Supabase REST API
# Uses direct SQL execution through PostgREST

set -e

# Load environment variables
if [ -f .env.local ]; then
  export $(grep -v '^#' .env.local | xargs)
fi

if [ -z "$NEXT_PUBLIC_SUPABASE_URL" ] || [ -z "$SUPABASE_SERVICE_ROLE_KEY" ]; then
  echo "❌ Missing Supabase environment variables"
  echo "Required: NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY"
  exit 1
fi

echo ""
echo "🔵 Running database migrations..."
echo "📍 Project: $NEXT_PUBLIC_SUPABASE_URL"
echo ""

# Function to execute SQL via Supabase REST API
execute_sql() {
  local sql_file=$1
  local sql_content=$(cat "$sql_file")

  echo "📝 Running migration: $(basename $sql_file)"

  # Use curl to execute SQL via Supabase REST API
  response=$(curl -s -w "\n%{http_code}" -X POST \
    "$NEXT_PUBLIC_SUPABASE_URL/rest/v1/rpc/exec_sql" \
    -H "apikey: $SUPABASE_SERVICE_ROLE_KEY" \
    -H "Authorization: Bearer $SUPABASE_SERVICE_ROLE_KEY" \
    -H "Content-Type: application/json" \
    -d "{\"sql_query\": $(echo "$sql_content" | jq -Rs .)}")

  http_code=$(echo "$response" | tail -n1)
  body=$(echo "$response" | sed '$d')

  if [ "$http_code" -ge 200 ] && [ "$http_code" -lt 300 ]; then
    echo "   ✅ Success"
    echo ""
  else
    echo "   ❌ Failed (HTTP $http_code)"
    echo "   Response: $body"
    echo ""
    echo "⚠️  Migration failed. You may need to run this manually in Supabase SQL Editor:"
    echo "📍 $sql_file"
    echo ""
    # Don't exit - try to continue with other migrations
  fi
}

# Run all migrations in order
for sql_file in supabase/migrations/*.sql; do
  if [ -f "$sql_file" ]; then
    execute_sql "$sql_file"
    sleep 1  # Small delay between migrations
  fi
done

echo "✅ Migration process completed!"
echo ""
echo "🔍 Verifying tables were created..."
echo "   Visit: $NEXT_PUBLIC_SUPABASE_URL/project/default/editor"
echo ""
